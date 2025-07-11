import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  openCheckoutForm: boolean;
  setOpenCheckoutForm: (open: boolean) => void;
  onPaymentSuccess: (paymentId : string) => void;
}

function CheckoutForm({
  openCheckoutForm,
  setOpenCheckoutForm,
  onPaymentSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: any) => {
    try {
      setLoading(true);
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://example.com/order/123/complete",
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Payment completed successfully");
        onPaymentSuccess(result.paymentIntent.id);
      }
    } catch (error) {
      toast.error("Failed to complete payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openCheckoutForm} onOpenChange={setOpenCheckoutForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Please fill in your card details to complete the payment
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="h-[400px] overflow-y-scroll overflow-x-hidden p-5"
        >
          <PaymentElement />


          <div className="flex justify-end mt-7 gap-5">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setOpenCheckoutForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Pay
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutForm;
