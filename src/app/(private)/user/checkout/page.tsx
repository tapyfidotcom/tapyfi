"use client";
import { getAddressesByUserId } from "@/actions/addresses";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import productsCartStore, {
  IProductsCartStore,
} from "@/global-store/products-cart-store";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { IAddress } from "@/interfaces";
import React from "react";
import toast from "react-hot-toast";
import AddressForm from "../addresses/_components/address-form";
import { useRouter } from "next/navigation";
import { getStripePaymentIntentToken } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./_components/checkout-form";
import { saveOrderAndOrderItems } from "@/actions/orders";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function UserCheckoutPage() {
  const router = useRouter();
  const [openAddressForm, setOpenAddressForm] = React.useState(false);
  const [addresses, setAddresses] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState<null | IAddress>(
    null
  );
  const [openCheckoutForm, setOpenCheckoutForm] = React.useState(false);
  const [paymentIntentToken, setPaymentIntentToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const { items , clearCart} = productsCartStore() as IProductsCartStore;

  const fetchAddresses = async () => {
    try {
      const response: any = await getAddressesByUserId(user.id);
      if (!response.success) {
        toast.error("Failed to fetch addresses");
      } else {
        setAddresses(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  React.useEffect(() => {
    fetchAddresses();
  }, []);

  let total = 0;
  let subTotal = 0;
  items.forEach((item) => {
    subTotal += item.price * item.quantity;
  });

  let deliveryFeeAndTax = subTotal * 0.1;

  total = parseFloat((subTotal + deliveryFeeAndTax).toFixed(2));

  const onCheckout = async () => {
    try {
      setLoading(true);
      const response = await getStripePaymentIntentToken(total);
      if (!response.success) {
        console.log(response);
        toast.error("Failed to checkout");
        return;
      }
      setPaymentIntentToken(response.data);
      setOpenCheckoutForm(true);
    } catch (error) {
      toast.error("Failed to checkout");
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = async (paymentId: string) => {
    try {
      const payload = {
        orderPayload: {
          customer_id: user.id,
          payment_id: paymentId,
          address_id: selectedAddress?.id,
          sub_total: subTotal,
          tax_shipping_fee: deliveryFeeAndTax,
          total,
          order_status: "order_placed",
        },
        items,
      };
      const response:any = await saveOrderAndOrderItems(payload);
      if (!response.success) {
        toast.error("Failed to save order");
        return;
      }

      clearCart();
      toast.success("Order placed successfully");
      router.push("/user/orders");
    } catch (error) {
      toast.error("Failed to save order");
    }
  };

  const options = {
    // passing the client secret obtained from the server
    clientSecret: paymentIntentToken,
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Checkout" />

      <h1 className="text-xl font-bold text-gray-600">
        Amount to pay: ${total.toFixed(2)}
      </h1>

      <div className="flex flex-col gap-5">
        <h1 className="text-sm font-bold">Select an address</h1>

        {addresses.map((address: IAddress) => (
          <div
            key={address.id}
            className={`p-5 border border-gray-300 rounded cursor-pointer ${
              selectedAddress?.id === address.id
                ? "border-primary border-2"
                : ""
            }`}
            onClick={() => setSelectedAddress(address)}
          >
            <h1 className="text-sm font-semibold">
              {address.name} ({address.phone_number}) - {address.email}
            </h1>
            <h1 className="text-sm text-gray-600">{address.address}</h1>
            <h1 className="text-sm text-gray-600">
              {address.city}, {address.state} {address.postal_code}
            </h1>
          </div>
        ))}

        <div className="flex justify-end underline cursor-pointer">
          <h1
            className="text-gray-600 text-sm font-bold"
            onClick={() => setOpenAddressForm(true)}
          >
            Add new address
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5">
        <Button variant={"outline"} onClick={() => router.push("/user/cart")}>
          Back to cart
        </Button>
        <Button disabled={!selectedAddress || loading} onClick={onCheckout}>
          Proceed to payment
        </Button>
      </div>

      {openAddressForm && (
        <AddressForm
          openAddressForm={openAddressForm}
          setOpenAddressForm={setOpenAddressForm}
        />
      )}

      {openCheckoutForm && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            openCheckoutForm={openCheckoutForm}
            setOpenCheckoutForm={setOpenCheckoutForm}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
}

export default UserCheckoutPage;
