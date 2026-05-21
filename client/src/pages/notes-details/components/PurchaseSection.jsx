import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useCart } from '../../../contexts/CartContext';

const PurchaseSection = ({ note, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = (note?.price * quantity)?.toFixed(2);

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 sticky top-20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Purchase Options
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-foreground/70">Quantity</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity === 1}
              className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Icon name="Minus" size={16} color="var(--color-foreground)" />
            </button>
            <span className="text-lg font-semibold text-foreground data-text min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity === 10}
              className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <Icon name="Plus" size={16} color="var(--color-foreground)" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-b border-border">
          <span className="text-base font-medium text-foreground">Total</span>
          <span className="text-2xl font-semibold text-primary data-text">
            ${totalPrice}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={() => onPurchase('buy-now', quantity)}
        >
          Buy Now
        </Button>

        <Button
          variant="outline"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          onClick={() => addToCart(note, quantity)}
        >
          Add to Cart
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={18} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Secure Payment</p>
            <p className="text-xs text-muted-foreground">
              Your payment information is encrypted
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Icon name="Download" size={18} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Instant Access</p>
            <p className="text-xs text-muted-foreground">
              Download immediately after purchase
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Icon name="RefreshCw" size={18} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Lifetime Access</p>
            <p className="text-xs text-muted-foreground">
              Re-download anytime from your account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSection;