import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { QRCodeSVG } from 'qrcode.react';

const PaymentModal = ({ isOpen, onClose, note, quantity }) => {
  const [paymentStep, setPaymentStep] = useState('method');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [qrPaymentId, setQrPaymentId] = useState('');

  const totalAmount = (note?.price * quantity)?.toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData?.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData?.cardNumber?.replace(/\s/g, '')?.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData?.cardName) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData?.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!formData?.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData?.cvv?.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'qr') {
      const paymentId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
      setQrPaymentId(paymentId);
      setPaymentStep('qr-scan');
    } else {
      setPaymentStep('details');
    }
  };

  const handleQrPaymentCheck = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentStep('success');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentStep('success');
  };

  const handleClose = () => {
    setPaymentStep('method');
    setPaymentMethod(null);
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      email: ''
    });
    setGuestEmail('');
    setQrPaymentId('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/95"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl elevation-5 overflow-hidden max-h-[90vh] overflow-y-auto">
        {paymentStep === 'method' && (
          <>
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingCart" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Choose Payment Method
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    No login required - Guest checkout available
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Close"
              >
                <Icon name="X" size={20} color="var(--color-foreground)" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="bg-muted/30 rounded-xl p-4 mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {note?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {note?.subject} • {note?.semester}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground data-text">
                    ${note?.price}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-foreground/70">
                    Quantity: {quantity}
                  </span>
                  <span className="text-lg font-semibold text-primary data-text">
                    Total: ${totalAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleMethodSelect('qr')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-smooth text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <Icon name="QrCode" size={24} color="var(--color-primary)" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-foreground mb-1">
                        Scan QR Code
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Quick payment via UPI, PayPal, or any QR scanner
                      </p>
                    </div>
                    <Icon name="ChevronRight" size={20} color="var(--color-muted-foreground)" />
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect('card')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-smooth text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <Icon name="CreditCard" size={24} color="var(--color-primary)" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-foreground mb-1">
                        Credit/Debit Card
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with your card
                      </p>
                    </div>
                    <Icon name="ChevronRight" size={20} color="var(--color-muted-foreground)" />
                  </div>
                </button>
              </div>

              <div className="mt-6 bg-success/10 border border-success/30 rounded-lg p-3 flex items-start space-x-2">
                <Icon name="Shield" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground/80">
                  Guest checkout enabled. Download link will be sent to your email. No account required.
                </p>
              </div>
            </div>
          </>
        )}

        {paymentStep === 'qr-scan' && (
          <>
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPaymentStep('method')}
                  className="p-2 rounded-lg hover:bg-muted transition-smooth"
                  aria-label="Back"
                >
                  <Icon name="ArrowLeft" size={20} color="var(--color-foreground)" />
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Scan QR Code to Pay
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Use any UPI app or payment scanner
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Close"
              >
                <Icon name="X" size={20} color="var(--color-foreground)" />
              </button>
            </div>

            <div className="p-6 md:p-8 text-center">
              <div className="bg-white p-6 rounded-2xl inline-block mb-6 shadow-lg">
                <QRCodeSVG
                  value={JSON.stringify({
                    paymentId: qrPaymentId,
                    amount: totalAmount,
                    noteId: note?.id,
                    noteTitle: note?.title,
                    quantity: quantity,
                    merchant: 'EduNotes',
                    timestamp: Date.now()
                  })}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-foreground/70">Amount to Pay</span>
                  <span className="text-xl font-semibold text-primary data-text">
                    ${totalAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Payment ID</span>
                  <span className="text-xs font-mono text-foreground data-text">
                    {qrPaymentId}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Open your payment app</p>
                    <p className="text-xs text-muted-foreground">UPI, PayPal, or any QR scanner</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Scan the QR code above</p>
                    <p className="text-xs text-muted-foreground">Point your camera at the code</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Complete payment</p>
                    <p className="text-xs text-muted-foreground">Confirm the transaction in your app</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Input
                  label="Email for Download Link"
                  type="email"
                  placeholder="your.email@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e?.target?.value)}
                  description="We'll send your notes here after payment"
                  required
                />
              </div>

              <Button
                variant="default"
                fullWidth
                loading={isProcessing}
                onClick={handleQrPaymentCheck}
                disabled={!guestEmail || !/\S+@\S+\.\S+/?.test(guestEmail)}
              >
                {isProcessing ? 'Verifying Payment...' : 'I Have Completed Payment'}
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Payment verification may take a few seconds
              </p>
            </div>
          </>
        )}

        {paymentStep === 'details' && (
          <>
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPaymentStep('method')}
                  className="p-2 rounded-lg hover:bg-muted transition-smooth"
                  aria-label="Back"
                >
                  <Icon name="ArrowLeft" size={20} color="var(--color-foreground)" />
                </button>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="CreditCard" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Complete Payment
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Secure checkout powered by EduNotes
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Close"
              >
                <Icon name="X" size={20} color="var(--color-foreground)" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="bg-muted/30 rounded-xl p-4 mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {note?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {note?.subject} • {note?.semester}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground data-text">
                    ${note?.price}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-foreground/70">
                    Quantity: {quantity}
                  </span>
                  <span className="text-lg font-semibold text-primary data-text">
                    Total: ${totalAmount}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData?.email}
                  onChange={handleInputChange}
                  error={errors?.email}
                  description="Receipt will be sent to this email"
                  required
                />

                <Input
                  label="Card Number"
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData?.cardNumber}
                  onChange={handleInputChange}
                  error={errors?.cardNumber}
                  maxLength={19}
                  required
                />

                <Input
                  label="Cardholder Name"
                  type="text"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData?.cardName}
                  onChange={handleInputChange}
                  error={errors?.cardName}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData?.expiryDate}
                    onChange={handleInputChange}
                    error={errors?.expiryDate}
                    maxLength={5}
                    required
                  />

                  <Input
                    label="CVV"
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={formData?.cvv}
                    onChange={handleInputChange}
                    error={errors?.cvv}
                    maxLength={3}
                    required
                  />
                </div>

                <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-start space-x-2">
                  <Icon name="Shield" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground/80">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  loading={isProcessing}
                  iconName="Lock"
                  iconPosition="left"
                  className="mt-6"
                >
                  {isProcessing ? 'Processing Payment...' : `Pay $${totalAmount}`}
                </Button>
              </form>
            </div>
          </>
        )}

        {paymentStep === 'success' && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle2" size={48} color="var(--color-success)" />
            </div>

            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Payment Successful!
            </h3>

            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Your purchase has been completed successfully. Download link has been sent to your email.
            </p>

            <div className="bg-muted/30 rounded-xl p-6 mb-6 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-foreground/70">Order ID</span>
                <span className="text-sm font-medium text-foreground data-text">
                  #EDU{Math.floor(Math.random() * 1000000)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-foreground/70">Amount Paid</span>
                <span className="text-sm font-medium text-foreground data-text">
                  ${totalAmount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Date</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date()?.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                iconName="Download"
                iconPosition="left"
              >
                Download Notes
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={handleClose}
              >
                Continue Browsing
              </Button>
            </div>

            <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-3">
              <p className="text-xs text-foreground/80">
                <Icon name="Mail" size={14} color="var(--color-primary)" className="inline mr-1" />
                Check your email for the download link and receipt
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;