import { useState } from 'react';
import { toast } from 'sonner';
import { CreditCard, IndianRupee, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentStepProps {
  onPaymentComplete: () => void;
  onPaymentCancel: () => void;
  interviewType: string;
}

const PaymentStep = ({ onPaymentComplete, onPaymentCancel, interviewType }: PaymentStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // In a real implementation, this would connect to a payment gateway like Razorpay, Paytm, or PhonePe
  const handlePayment = () => {
    // Validate form based on payment method
    if (paymentMethod === 'creditCard') {
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        toast.error('Please fill in all credit card details');
        return;
      }

      // Simple validation
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return;
      }

      if (cvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return;
      }
    } else if (paymentMethod === 'paytm' || paymentMethod === 'phonePe') {
      if (!mobileNumber) {
        toast.error('Please enter your mobile number');
        return;
      }

      // Simple mobile number validation (10 digits)
      if (mobileNumber.replace(/\D/g, '').length !== 10) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    // Simulate payment processing
    setIsProcessing(true);
    
    // In a real implementation, we would redirect to the respective payment gateway
    // For Paytm: Redirect to Paytm payment page
    // For PhonePe: Redirect to PhonePe payment page
    // For now, we'll simulate the payment process
    
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Payment successful via ${getPaymentMethodName(paymentMethod)}!`);
      onPaymentComplete();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobileNumber(value.slice(0, 10));
  };

  const getPaymentMethodName = (method: string): string => {
    switch (method) {
      case 'creditCard': return 'Credit Card';
      case 'paytm': return 'Paytm';
      case 'phonePe': return 'PhonePe';
      default: return 'Unknown';
    }
  };

  const interviewTypeLabels: Record<string, string> = {
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    mock: 'Mock Interview',
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Complete Payment</h2>
        <p className="text-muted-foreground mt-2">
          Your interview will be scheduled after payment is completed
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Secure payment for {interviewTypeLabels[interviewType] || interviewType}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="font-medium">Interview Fee</span>
            </div>
            <span className="text-lg font-bold">₹100.00</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className={`flex flex-col items-center justify-between rounded-md border-2 p-4 ${paymentMethod === 'creditCard' ? 'border-primary' : 'border-muted'}`}>
                  <RadioGroupItem value="creditCard" id="creditCard" className="sr-only" />
                  <CreditCard className="h-6 w-6 mb-3" />
                  <Label htmlFor="creditCard" className="font-medium">Credit Card</Label>
                </div>
                <div className={`flex flex-col items-center justify-between rounded-md border-2 p-4 ${paymentMethod === 'paytm' ? 'border-primary' : 'border-muted'}`}>
                  <RadioGroupItem value="paytm" id="paytm" className="sr-only" />
                  <QrCode className="h-6 w-6 mb-3" />
                  <Label htmlFor="paytm" className="font-medium">Paytm</Label>
                </div>
                <div className={`flex flex-col items-center justify-between rounded-md border-2 p-4 ${paymentMethod === 'phonePe' ? 'border-primary' : 'border-muted'}`}>
                  <RadioGroupItem value="phonePe" id="phonePe" className="sr-only" />
                  <Smartphone className="h-6 w-6 mb-3" />
                  <Label htmlFor="phonePe" className="font-medium">PhonePe</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'creditCard' ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input 
                    id="nameOnCard" 
                    placeholder="John Doe" 
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      placeholder="MM/YY" 
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      type="password" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input 
                    id="mobileNumber" 
                    placeholder="10-digit mobile number" 
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    maxLength={10}
                    type="tel"
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod === 'paytm' ? 
                      'You will be redirected to Paytm to complete your payment securely.' : 
                      'You will be redirected to PhonePe to complete your payment securely.'}
                  </p>
                </div>
              </div>
            )}  
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={onPaymentCancel}
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button 
            className="w-full sm:w-auto flex items-center gap-2" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                {paymentMethod === 'creditCard' && <CreditCard className="h-4 w-4" />}
                {paymentMethod === 'paytm' && <QrCode className="h-4 w-4" />}
                {paymentMethod === 'phonePe' && <Smartphone className="h-4 w-4" />}
                Pay ₹100.00
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentStep;