import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc,
  serverTimestamp,
  getDocs,
  deleteDoc
} from "firebase/firestore";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser, username } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const addToCart = async (item) => {
    console.log('========================================');
    console.log('🛒 ADD TO CART FUNCTION CALLED!');
    console.log('========================================');
    console.log('📦 Item to add:', item);
    console.log('📦 Item name:', item?.name);
    console.log('📦 Item price:', item?.price);
    console.log('📦 Current cart before adding:', cartItems);
    console.log('📦 Current cart length:', cartItems.length);
    console.log('👤 Current user:', currentUser);
    
    if (!currentUser) {
      console.error('❌ User not logged in! Cannot save to Firebase cart.');
      alert('❌ Please login first to add items to cart!');
      return;
    }
    
    const newCart = [...cartItems, item];
    console.log('📦 New cart after adding:', newCart);
    console.log('📦 New cart length:', newCart.length);
    
    // Update local state
    setCartItems(newCart);
    
    // 🔥 SAVE TO FIREBASE: customers/{user}/cart/
    try {
      console.log('💾 Saving item to Firebase cart...');
      console.log('📍 Firebase path: customers/' + currentUser + '/cart');
      
      const cartDoc = await addDoc(collection(db, 'customers', currentUser, 'cart'), {
        name: item.name,
        description: item.description || '',
        price: item.price || 0,
        toppings: item.toppings || {},
        addedAt: new Date().toISOString(),
        timestamp: Date.now(),
        customer: currentUser
      });
      
      console.log('✅✅✅ Item saved to Firebase cart! Doc ID:', cartDoc.id);
      console.log('🔥 Check Firebase: customers/' + currentUser + '/cart/' + cartDoc.id);
    } catch (error) {
      console.error('❌ Failed to save to Firebase cart:', error);
      console.error('Error message:', error.message);
      alert('⚠️ Item added to local cart but Firebase save failed!\n\n' + error.message);
    }
    
    console.log('✅ Item added to cart successfully!');
    console.log('========================================');
  };

  const removeFromCart = (index) => {
    console.log('🗑️ Removing item at index:', index);
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
  };

  const clearCart = async () => {
    console.log('🧹 Clearing cart');
    setCartItems([]);
    
    // 🔥 Also clear Firebase cart
    if (currentUser) {
      try {
        console.log('🔥 Clearing Firebase cart for:', currentUser);
        const cartRef = collection(db, 'customers', currentUser, 'cart');
        const cartSnapshot = await getDocs(cartRef);
        
        console.log('📦 Found', cartSnapshot.size, 'items to delete from Firebase');
        
        const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        console.log('✅ Firebase cart cleared!');
      } catch (error) {
        console.error('❌ Failed to clear Firebase cart:', error);
      }
    }
  };

  const placeOrder = async (orderData = {}) => {
    console.log('🚀 PLACE ORDER - Fast processing...');
    
    if (!currentUser) {
      alert('❌ Please log in first!');
      return null;
    }
    
    if (!cartItems || cartItems.length === 0) {
      alert('❌ Cart is empty!');
      return null;
    }
    
    console.log('✅ Processing ' + cartItems.length + ' orders...');
    
    const createdOrderIds = [];
    const orderTimestamp = Date.now();
    
    try {
      for (let index = 0; index < cartItems.length; index++) {
        const item = cartItems[index];
        const orderNumber = `ORD-${orderTimestamp}-${index}`;
        
        const singleOrder = {
          customer: currentUser,
          customerDisplayName: username || currentUser,
          items: [{
            name: item.name,
            price: item.price,
            description: item.description || '',
            position: 1,
            orderedBy: currentUser
          }],
          itemCount: 1,
          total: item.price || 0,
          status: 'pending',
          timestamp: orderTimestamp + index,
          createdAt: new Date(orderTimestamp + index).toISOString(),
          orderedDate: new Date().toLocaleDateString(),
          orderedTime: new Date().toLocaleTimeString(),
          orderNumber: orderNumber,
          source: 'web'
        };
        
        // Save to Firebase (fast - no delays)
        try {
          const customerOrderRef = await addDoc(collection(db, 'customers', currentUser, 'orders'), singleOrder);
          await addDoc(collection(db, 'orders'), singleOrder);
          await addDoc(collection(db, 'orderHistory'), { ...singleOrder, firestoreOrderId: customerOrderRef.id });
          createdOrderIds.push(customerOrderRef.id);
        } catch (saveError) {
          alert('❌ FIREBASE SAVE FAILED!\n\n' + saveError.message);
          throw saveError;
        }
      }
      
      console.log('✅ All orders created successfully!');
      
      // Build items list for popup
      const itemsList = cartItems.map((item, idx) => 
        `${idx + 1}. ${item.name} - ₹${item.price}`
      ).join('\n');
      
      // Calculate total
      const orderTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
      
      // Show success alert with items and total
      alert(
        '✅ Order Placed Successfully!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '🍕 Your Orders:\n\n' +
        itemsList + '\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        `💰 Total: ₹${orderTotal}\n\n` +
        `📦 ${cartItems.length} ${cartItems.length === 1 ? 'order' : 'separate orders'} created!\n\n` +
        'Redirecting to Order History...'
      );
      
      // ✅ CLEAR CART after successful order placement
      console.log('🧹 Clearing cart after successful order placement...');
      clearCart();
      console.log('✅ Cart cleared! Cart is now empty.');
      
      return createdOrderIds[0];
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Failed to save orders!\n\n' + error.message);
      throw error;
    }
  };

  const updateOrderStatus = async (orderDocumentPath, newStatus) => {
    console.log('🔄 Updating order status:', orderDocumentPath, '->', newStatus);
    
    try {
      const orderRef = doc(db, orderDocumentPath);
      const updateData = {
        status: newStatus,
        updatedAt: serverTimestamp()
      };
      
      if (newStatus === 'delivered' || newStatus === 'confirmed') {
        updateData.deliveredAt = serverTimestamp();
      } else if (newStatus === 'cancelled') {
        updateData.cancelledAt = serverTimestamp();
      }
      
      await updateDoc(orderRef, updateData);
      console.log('✅ Status updated!');
      alert(`✅ Order status updated to: ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Failed to update status!\n\n' + error.message);
      throw error;
    }
  };

  useEffect(() => {
    console.log('========================================');
    console.log('📚 ORDER HISTORY USEEFFECT TRIGGERED');
    console.log('========================================');
    console.log('👤 Current User:', currentUser);
    
    if (!currentUser) {
      console.log('⚠️ No user logged in, clearing order history');
      setOrderHistory([]);
      return;
    }
    
    console.log('✅ User logged in, setting up Firebase listener...');
    console.log('📍 Listening to: customers/' + currentUser + '/orders');
    
    const unsubscribe = onSnapshot(
      collection(db, 'customers', currentUser, 'orders'),
      (snapshot) => {
        console.log('========================================');
        console.log('🔥 FIREBASE SNAPSHOT RECEIVED!');
        console.log('========================================');
        console.log('📦 Total documents in snapshot:', snapshot.size);
        console.log('📦 Empty?:', snapshot.empty);
        
        const orders = [];
        snapshot.forEach((doc) => {
          const orderData = { id: doc.id, documentPath: doc.ref.path, ...doc.data() };
          console.log('📄 Document:', doc.id);
          console.log('   - Order Number:', orderData.orderNumber);
          console.log('   - Items:', orderData.items);
          console.log('   - Status:', orderData.status);
          console.log('   - Timestamp:', orderData.timestamp);
          orders.push(orderData);
        });
        
        orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        console.log('========================================');
        console.log('✅ Orders loaded and sorted!');
        console.log('📦 Total orders:', orders.length);
        console.log('📦 Orders array:', orders);
        console.log('========================================');
        
        setOrderHistory(orders);
      },
      (error) => {
        console.error('========================================');
        console.error('❌ ERROR in Firebase listener!');
        console.error('========================================');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('========================================');
      }
    );
    
    return () => {
      console.log('🧹 Cleaning up Firebase listener for:', currentUser);
      unsubscribe();
    };
  }, [currentUser]);

  // 🔥 NEW: Load cart items from Firebase when user logs in
  useEffect(() => {
    console.log('========================================');
    console.log('🛒 CART ITEMS LISTENER EFFECT TRIGGERED');
    console.log('========================================');
    console.log('👤 Current User:', currentUser);
    
    if (!currentUser) {
      console.log('⚠️ No user logged in, clearing cart');
      setCartItems([]);
      return;
    }
    
    console.log('✅ User logged in, loading cart from Firebase...');
    console.log('📍 Listening to: customers/' + currentUser + '/cart');
    
    const unsubscribe = onSnapshot(
      collection(db, 'customers', currentUser, 'cart'),
      (snapshot) => {
        console.log('========================================');
        console.log('🛒 FIREBASE CART SNAPSHOT RECEIVED!');
        console.log('========================================');
        console.log('📦 Total cart items in Firebase:', snapshot.size);
        
        const items = [];
        snapshot.forEach((doc) => {
          const itemData = doc.data();
          console.log('📄 Cart Item:', doc.id, itemData);
          items.push({
            id: doc.id,
            documentPath: doc.ref.path,
            ...itemData
          });
        });
        
        console.log('✅ Cart items loaded from Firebase!');
        console.log('📦 Total items:', items.length);
        console.log('📦 Items array:', items);
        
        setCartItems(items);
      },
      (error) => {
        console.error('❌ ERROR loading cart from Firebase!', error);
      }
    );
    
    return () => {
      console.log('🧹 Cleaning up cart listener for:', currentUser);
      unsubscribe();
    };
  }, [currentUser]);

  const confirmOrder = () => {
    console.log('confirmOrder called (deprecated)');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orderHistory,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        confirmOrder,
        updateOrderStatus
      }}
    >
      {children}
    </CartContext.Provider>
  );
}