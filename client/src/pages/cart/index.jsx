import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';
import PaymentModal from '../notes-details/components/PaymentModal';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);

  const handleQuantityChange = (noteId, change) => {
    const item = cartItems?.find(item => item?.id === noteId);
    if (item) {
      const newQuantity = item?.quantity + change;
      if (newQuantity >= 1 && newQuantity <= 10) {
        updateQuantity(noteId, newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems?.length === 1) {
      setSelectedNote(cartItems?.[0]);
      setCheckoutQuantity(cartItems?.[0]?.quantity);
      setIsPaymentModalOpen(true);
    } else if (cartItems?.length > 1) {
      const firstNote = cartItems?.[0];
      setSelectedNote({
        ...firstNote,
        title: `${cartItems?.length} Notes Bundle`,
        price: getCartTotal()
      });
      setCheckoutQuantity(1);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth mb-4"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Shopping Cart
                </h1>
                <p className="text-muted-foreground">
                  {cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              
              {cartItems?.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  iconName="Trash2"
                  iconPosition="left"
                  className="text-error hover:text-error"
                >
                  Clear Cart
                </Button>
              )}
            </div>
          </div>

          {cartItems?.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Looks like you haven't added any notes yet. Browse our collection to find the perfect study materials.
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/notes/years')}
                iconName="BookOpen"
                iconPosition="left"
              >
                Browse Notes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems?.map((item) => (
                  <div
                    key={item?.id}
                    className="bg-card rounded-xl border border-border p-4 md:p-6 hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div
                        className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted cursor-pointer"
                        onClick={() => navigate(`/note-details?id=${item?.id}`)}
                      >
                        <Image
                          src={item?.thumbnail}
                          alt={item?.thumbnailAlt}
                          className="w-full h-full object-cover hover:scale-105 transition-smooth"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => navigate(`/note-details?id=${item?.id}`)}
                          >
                            <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-smooth">
                              {item?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item?.subject} • Semester {item?.semester}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item?.id)}
                            className="p-2 rounded-lg hover:bg-error/10 transition-smooth group"
                            aria-label="Remove from cart"
                          >
                            <Icon
                              name="Trash2"
                              size={18}
                              color="var(--color-muted-foreground)"
                              className="group-hover:text-error"
                            />
                          </button>
                        </div>

                        <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Icon name="FileText" size={14} />
                            <span>{item?.pages} pages</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Star" size={14} color="var(--color-accent)" fill="var(--color-accent)" />
                            <span>{item?.rating?.toFixed(1)}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item?.id, -1)}
                              disabled={item?.quantity === 1}
                              className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Icon name="Minus" size={16} color="var(--color-foreground)" />
                            </button>
                            <span className="text-lg font-semibold text-foreground data-text min-w-[2rem] text-center">
                              {item?.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item?.id, 1)}
                              disabled={item?.quantity === 10}
                              className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Icon name="Plus" size={16} color="var(--color-foreground)" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-semibold text-foreground data-text">
                              ${(item?.price * item?.quantity)?.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${item?.price?.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium data-text">
                        ${getCartTotal()?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-medium data-text">
                        $0.00
                      </span>
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary data-text">
                        ${getCartTotal()?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    fullWidth
                    onClick={handleCheckout}
                    iconName="CreditCard"
                    iconPosition="left"
                    className="mb-3"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/branch-notes-list')}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Continue Shopping
                  </Button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Icon name="Shield" size={18} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Secure Checkout</p>
                        <p className="text-xs text-muted-foreground">
                          Your payment is encrypted and secure
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedNote && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedNote(null);
          }}
          note={selectedNote}
          quantity={checkoutQuantity}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Cart;