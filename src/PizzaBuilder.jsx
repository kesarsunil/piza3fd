import React, { Suspense, useState, useRef, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import "./index.css";

const VEG_TOPPINGS = [
  { name: "Onion", price: 25, emoji: "🧅", color: "#e2b97f", mesh: "sphere", model: "/Red_Onion_Ring_0724070222_texture.glb" },
  { name: "Capsicum", price: 30, emoji: "🫑", color: "#4caf50", mesh: "sphere", model: "/Pepper_Slice_Symphony_0724070457_texture.glb" },
  { name: "Olives", price: 35, emoji: "🫒", color: "#556b2f", mesh: "sphere" },
  { name: "Sweet Corn", price: 30, emoji: "🌽", color: "#ffe066", mesh: "sphere" },
  { name: "Paneer", price: 40, emoji: "🧀", color: "#fffde7", mesh: "box", model: "/Grilled_Paneer_Deligh_0724062829_texture.glb" },
];
const NONVEG_TOPPINGS = [
  { name: "Chicken", price: 40, emoji: "🍗", color: "#d2691e", mesh: "sphere", model: "/Peppery_Tofu_Cube_0724064751_texture.glb" },
  { name: "Sausage", price: 40, emoji: "🌭", color: "#b5651d", mesh: "cylinder" },
  { name: "Pepperoni", price: 40, emoji: "🍕", color: "#b71c1c", mesh: "cylinder" },
];
const EXTRAS = [
  { name: "Cheese Burst", price: 30, emoji: "🧀", color: "#fffde7", mesh: "sphere" },
  { name: "Extra Cheese", price: 30, emoji: "🧀", color: "#fffde7", mesh: "sphere" },
  { name: "Jalapeños", price: 30, emoji: "🌶️", color: "#43a047", mesh: "sphere" },
];
const ALL_TOPPINGS = [...VEG_TOPPINGS, ...NONVEG_TOPPINGS, ...EXTRAS];

function PizzaModel(props) {
  const { scene } = useGLTF("/Pepperoni_Delight_0720122513_texture.glb");
  return <primitive object={scene} {...props} />;
}

function ToppingList({ title, toppings, badge, onAdd, onRemove, toppingCounts }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: '#000', margin: '16px 0 8px 0' }}>{title}</h3>
      {toppings.map((topping) => {
        const count = toppingCounts[topping.name] || 0;
        return (
          <div key={topping.name} style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 28 }}>{topping.emoji}</span>
            <div style={{ flex: 1, marginLeft: 16 }}>
              <div style={{ fontWeight: 600 }}>{topping.name}</div>
              <div style={{ color: '#888', fontSize: 14 }}>₹{topping.price}</div>
            </div>
            <span style={{ background: '#e0f7fa', color: '#388e3c', borderRadius: 8, padding: '2px 8px', fontSize: 12, marginRight: 8 }}>{badge}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={{ background: count === 0 ? '#eee' : '#f44336', color: count === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, cursor: count === 0 ? 'not-allowed' : 'pointer', fontSize: 18 }} onClick={() => onRemove(topping.name)} disabled={count === 0}>-</button>
              <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 600 }}>{count / 10}</span>
              <button style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 18 }} onClick={() => onAdd(topping.name)}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getToppingData(name) {
  return ALL_TOPPINGS.find(t => t.name === name);
}

function randomPizzaPosition(isOnion = false) {
  const r = isOnion ? 1.2 + Math.random() * 0.9 : 1.1 + Math.random() * 0.7;
  const theta = Math.random() * 2 * Math.PI;
  const x = r * Math.cos(theta);
  const y = isOnion ? 0.45 + Math.random() * 0.2 : 0.25 + Math.random() * 0.1;
  const z = r * Math.sin(theta);
  return [x, y, z];
}

function SprinkledTopping({ topping, pieces }) {
  const meshRefs = useRef([]);
  const toppingData = getToppingData(topping);
  let ModelComponent = null;
  if (toppingData && toppingData.model) {
    ModelComponent = function ModelInstance(props) {
      const { scene } = useGLTF(toppingData.model);
      return <primitive object={scene} {...props} />;
    };
  }
  useFrame(() => {
    meshRefs.current.forEach((ref, i) => {
      if (ref && ref.position.y > 0.1) {
        ref.position.y -= 0.08 + Math.random() * 0.04;
        if (ref.position.y < 0.1) ref.position.y = 0.1;
      }
    });
  });
  return pieces.map((piece, i) => {
    const { color, mesh, model, name } = toppingData;
    const [x, y, z] = piece;
    if (model && ModelComponent) {
      let scale = [0.25, 0.25, 0.25];
      let yOffset = y;
      if (name === 'Paneer' || name === 'Chicken') {
        scale = [0.18, 0.18, 0.18];
      } else if (name === 'Onion') {
        scale = [0.12, 0.12, 0.12];
        yOffset = y;
      }
      return <group ref={el => meshRefs.current[i] = el} key={`${topping}-model-${i}-${x.toFixed(2)}-${z.toFixed(2)}`} position={[x, yOffset, z]} scale={scale}>
        <ModelComponent />
      </group>;
    } else if (mesh === "sphere") {
      return <mesh ref={el => meshRefs.current[i] = el} key={`${topping}-sphere-${i}-${x.toFixed(2)}-${z.toFixed(2)}`} position={[x, 2 + Math.random() * 1, z]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>;
    } else if (mesh === "box") {
      return <mesh ref={el => meshRefs.current[i] = el} key={`${topping}-box-${i}-${x.toFixed(2)}-${z.toFixed(2)}`} position={[x, 2 + Math.random() * 1, z]}>
        <boxGeometry args={[0.13, 0.07, 0.13]} />
        <meshStandardMaterial color={color} />
      </mesh>;
    } else if (mesh === "cylinder") {
      return <mesh ref={el => meshRefs.current[i] = el} key={`${topping}-cylinder-${i}-${x.toFixed(2)}-${z.toFixed(2)}`} position={[x, 2 + Math.random() * 1, z]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>;
    }
    return null;
  });
}

export default function PizzaBuilder() {
  const [toppings, setToppings] = useState({});
  const [sprinkles, setSprinkles] = useState([]);
  const { addToCart, cartItems, clearCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [swipeOrder, setSwipeOrder] = useState(false);
  const cartSectionRef = useRef(null);

  const handleAddTopping = (name) => {
    const isOnion = name === 'Onion';
    const newPieces = Array.from({ length: 20 }, () => randomPizzaPosition(isOnion));
    setSprinkles(s => [...s, { topping: name, pieces: newPieces }]);
    setToppings(t => ({ ...t, [name]: (t[name] || 0) + 20 }));
  };

  const handleRemoveTopping = (name) => {
    setToppings(t => {
      const current = t[name] || 0;
      if (current <= 0) return t;
      setSprinkles(s => {
        let removed = 0;
        return s.filter(sprinkle => {
          if (sprinkle.topping === name && removed < 1) {
            removed++;
            return false;
          }
          return true;
        });
      });
      return { ...t, [name]: current - 10 };
    });
  };

  const totalPrice = Object.entries(toppings).reduce((sum, [name, count]) => {
    if (count > 0) {
      const data = getToppingData(name);
      return sum + (data ? data.price * (count / 10) : 0);
    }
    return sum;
  }, 0);

  const getPizzaDescription = () => {
    const selected = Object.entries(toppings).filter(([_, count]) => count > 0);
    if (selected.length === 0) return "No toppings";
    return selected.map(([name, count]) => `${name} x${count / 10}`).join(", ");
  };

  const handleAddPizzaToCart = () => {
    if (!addToCart) return;
    const pizza = {
      name: "Custom Pizza",
      description: getPizzaDescription(),
      price: totalPrice,
      toppings: { ...toppings },
    };
    addToCart(pizza);
  };

  // Scroll to cart section
  const handleCartScroll = () => {
    if (cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart total
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // Place order logic with swipe animation
  const handlePlaceOrder = () => {
    setSwipeOrder(true);
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      setSwipeOrder(false);
    }, 600); // match animation duration
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 50%, #191654 100%)', margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#fff', boxShadow: '0 2px 8px #eee', width: '100vw', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', color: '#000' }}>
          <span style={{ fontSize: 32, marginRight: 8 }}>🍕</span> Pizza Builder
          <div style={{ fontSize: 14, fontWeight: 400, color: '#888', marginLeft: 16 }}>Create your perfect pizza masterpiece</div>
        </div>
        <div>
          <span style={{ marginRight: 24, fontWeight: 600, fontSize: 18, color: '#000' }}>₹{totalPrice}</span>
          <button
            onClick={handleCartScroll}
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              fontWeight: 600,
              fontSize: 16,
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              boxShadow: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{ marginRight: 8 }}>🛒</span> Cart
          </button>
        </div>
      </div>
      {/* Main Layout */}
      <div style={{ display: 'flex', height: 'calc(100vh - 72px)', width: '100vw' }}>
        {/* Sidebar */}
        <div style={{ width: 350, background: 'rgba(255,255,255,0.85)', boxShadow: '2px 0 8px #eee', padding: 24, overflowY: 'auto', height: '100%', maxHeight: '79vh', borderRadius: 18, marginTop: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, color: '#000' }}><span role="img" aria-label="pizza">🍕</span> Build Your Pizza</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 24 }}>Choose your favorite toppings to create the perfect pizza</div>
          <ToppingList title="Vegetarian Toppings ✨" toppings={VEG_TOPPINGS} badge="Vegetarian" onAdd={handleAddTopping} onRemove={handleRemoveTopping} toppingCounts={toppings} />
          <ToppingList title="Non-Veg Toppings 🍗" toppings={NONVEG_TOPPINGS} badge="Non-Veg" onAdd={handleAddTopping} onRemove={handleRemoveTopping} toppingCounts={toppings} />
          <ToppingList title="Extras 🧀" toppings={EXTRAS} badge="Extra" onAdd={handleAddTopping} onRemove={handleRemoveTopping} toppingCounts={toppings} />
          <button
            onClick={handleAddPizzaToCart}
            style={{
              width: '100%',
              background: '#388e3c',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '14px 0',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e0e7ef',
              marginTop: 18,
            }}
            disabled={totalPrice === 0}
          >
            Add Pizza to Cart
          </button>
        </div>
        {/* 3D Pizza Viewer */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: '12px 24px', fontWeight: 600, fontSize: 18, zIndex: 2, color: '#000' }}>
            Your 3D Pizza <span style={{ fontWeight: 400, fontSize: 14, color: '#000', marginLeft: 8 }}>Drag to rotate • Scroll to zoom</span>
          </div>
          <div style={{ width: '95%', height: '90%', minHeight: 500, minWidth: 500, background: 'none', borderRadius: 24, boxShadow: '0 4px 32px #eee', marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Canvas camera={{ position: [0, 2, 5], fov: 50 }} shadows>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
              <Suspense fallback={null}>
                <Stage environment={null} intensity={0.6} contactShadow={{ opacity: 0.5, blur: 2 }}>
                  <PizzaModel scale={2.2} />
                  {sprinkles.map((s, i) => (
                    <SprinkledTopping key={i + s.topping} topping={s.topping} pieces={s.pieces} />
                  ))}
                </Stage>
              </Suspense>
              <OrbitControls enablePan={false} enableZoom={true} />
            </Canvas>
          </div>
        </div>
      </div>
      {/* Cart Section (scroll target) */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, #fff 0%, #b2dfdb 100%)', padding: '60px 0 80px 0', marginTop: 0 }}>
        <div
          ref={cartSectionRef}
          style={{
            maxWidth: 520,
            width: '100%',
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 4px 24px #e0e7ef',
            padding: '40px 32px 32px 32px',
            minHeight: 340,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Swipe animation overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#fff',
              zIndex: swipeOrder ? 10 : -1,
              transform: swipeOrder ? 'translateX(0%)' : 'translateX(-100%)',
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
          />
          {orderPlaced ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 260, textAlign: 'center' }}>
              <h2 style={{ color: '#388e3c', marginBottom: 24, fontSize: 28, fontWeight: 700 }}>Your order is confirmed!</h2>
            </div>
          ) : (
            <>
              <h1 style={{ textAlign: 'center', color: '#222', marginBottom: 28, fontSize: 28, fontWeight: 700 }}>Your Cart</h1>
              {cartItems.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', marginBottom: 32 }}>No items in cart.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
                  {cartItems.map((item, idx) => (
                    <li key={idx} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px', marginBottom: 14, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px #e0e7ef' }}>
                      <span style={{ fontWeight: 600, color: '#222', fontSize: 18 }}>{item.name}</span>
                      <span style={{ color: '#888', fontSize: 15, marginTop: 4 }}>{item.description}</span>
                      {item.price !== undefined && (
                        <span style={{ color: '#000', fontWeight: 600, fontSize: 16, marginTop: 4 }}>₹{item.price}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Total: <span style={{ color: '#222' }}>₹{cartTotal}</span></div>
              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || swipeOrder}
                style={{
                  width: '100%',
                  background: cartItems.length === 0 ? '#ccc' : '#388e3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '14px 0',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px #e0e7ef',
                  marginBottom: 18,
                }}
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/Pepperoni_Delight_0720122513_texture.glb");
useGLTF.preload("/Red_Onion_Ring_0724070222_texture.glb");
useGLTF.preload("/Pepper_Slice_Symphony_0724070457_texture.glb");
useGLTF.preload("/Grilled_Paneer_Deligh_0724062829_texture.glb");
useGLTF.preload("/Peppery_Tofu_Cube_0724064751_texture.glb"); 