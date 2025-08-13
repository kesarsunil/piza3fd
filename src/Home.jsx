import React, { useContext } from "react";
import { CartContext } from "./CartContext";

export default function Home() {
  const { addToCart } = useContext(CartContext);

  const pizza = { name: "Margherita", description: "Classic cheese pizza" };

  return (
    <div>
      <h1>Pizza Builder</h1>
      <div>
        <h2>{pizza.name}</h2>
        <p>{pizza.description}</p>
        <button onClick={() => addToCart(pizza)}>Add to Cart</button>
      </div>
    </div>
  );
}