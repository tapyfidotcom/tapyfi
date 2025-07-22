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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addNewAddress } from "@/actions/addresses";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import toast from "react-hot-toast";

interface AddressFormProps {
  openAddressForm: boolean;
  setOpenAddressForm: (open: boolean) => void;
  initialValues?: any;
  formType?: "add" | "edit";
  onSave ?: () => void;
}

function AddressForm({
  openAddressForm,
  setOpenAddressForm,
  initialValues,
  formType = "add",
  onSave,
}: AddressFormProps) {
  const [loading, setLoading] = React.useState(false);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const addressFormSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    phone_number: z.number().positive(),
    city: z.string().nonempty(),
    state: z.string().nonempty(),
    postal_code: z.number().positive(),
    address: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone_number: initialValues?.phone_number || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      postal_code: initialValues?.postal_code || "",
      address: initialValues?.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof addressFormSchema>) {
    try {
      setLoading(true);
      const response = await addNewAddress({
        ...values,
        user_id: user.id,
      });
      if (response.success) {
        toast.success(response.message);
        setOpenAddressForm(false);
        form.reset();
        if (onSave) {
          onSave();
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={openAddressForm} onOpenChange={setOpenAddressForm}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {formType === "add" ? "Add Address" : "Edit Address"}
          </DialogTitle>
          <DialogDescription>
            Add / Edit your address details for the shipping purpose.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-7"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder=""
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-0">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-5">
              {" "}
              <Button
                onClick={() => setOpenAddressForm(false)}
                disabled={loading}
                variant={"outline"}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddressForm;
