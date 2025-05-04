import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewAddress,
    deleteAddress,
    editAddress,
    fetchAllAddresses,
    setAddressList
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/store/store";

interface Address {
    _id: string;
    address: string;
    city: string;
    phone: string;
    pincode: string;
    notes?: string;
    userId: string;
}

type AddressFormData = Omit<Address, "_id" | "userId">;

const initialAddressFormData: AddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
};

type AddressProps = {
    setCurrentSelectedAddress?: (address: Address) => void;
    selectedId?: string;
};

function Address({ setCurrentSelectedAddress, selectedId }: AddressProps) {
    const [formData, setFormData] = useState<AddressFormData>(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);
    const [localAddresses, setLocalAddresses] = useState<Address[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { addressList, isLoading } = useSelector((state: RootState) => state.shopAddress);

    // Update local addresses whenever Redux state changes
    useEffect(() => {
        if (Array.isArray(addressList) && addressList.length > 0) {
            // Filter out any invalid addresses (missing _id)
            const validAddresses = addressList.filter(addr => addr && addr._id);
            setLocalAddresses(validAddresses);
        }
    }, [addressList]);

    const isFormValid = () =>
        formData.address.trim() &&
        formData.city.trim() &&
        formData.phone.trim() &&
        formData.pincode.trim();

    const resetForm = () => {
        setFormData(initialAddressFormData);
        setCurrentEditedId(null);
    };

    // Helper function to extract the actual address from API response
    const extractAddressFromResponse = (responseData: any): Address | null => {
        // If it's a direct Address object
        if (responseData && responseData._id) {
            return responseData as Address;
        }
        
        // If it's wrapped in a success/data structure
        if (responseData && responseData.success && responseData.data) {
            const data = responseData.data;
            if (data._id) {
                return data as Address;
            }
        }
        
        console.error("Invalid address response format:", responseData);
        return null;
    };

    const handleManageAddress = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!user?.id) {
            toast.error("Please log in to manage addresses");
            return;
        }

        if (localAddresses.length >= 3 && currentEditedId === null) {
            toast.error("You can add max 3 addresses");
            return;
        }

        try {
            if (currentEditedId) {
                const result = await dispatch(
                    editAddress({
                        userId: user.id,
                        addressId: currentEditedId,
                        formData: { ...formData, userId: user.id },
                    })
                );

                if (result?.meta?.requestStatus === "fulfilled") {
                    toast.success("Address updated successfully");
                    resetForm();
                    
                    // Ensure we properly extract the address from the response
                    const updatedAddress = extractAddressFromResponse(result.payload);
                    if (updatedAddress) {
                        // Update local state
                        const updatedList = localAddresses.map(addr => 
                            addr._id === updatedAddress._id ? updatedAddress : addr
                        );
                        setLocalAddresses(updatedList);
                        
                        // Update Redux store
                        dispatch(setAddressList(updatedList));
                    }
                    
                    // Also fetch from server to ensure we're in sync
                    dispatch(fetchAllAddresses(user.id));
                } else {
                    toast.error("Failed to update address");
                }
            } else {
                const result = await dispatch(
                    addNewAddress({ ...formData, userId: user.id })
                );

                if (result?.meta?.requestStatus === "fulfilled") {
                    toast.success("Address added successfully");
                    resetForm();
                    
                    // Ensure we properly extract the address from the response
                    const newAddress = extractAddressFromResponse(result.payload);
                    if (newAddress) {
                        // Update local state
                        const newList = [...localAddresses, newAddress];
                        setLocalAddresses(newList);
                        
                        // Update Redux store
                        dispatch(setAddressList(newList));
                    }
                    
                    // Also fetch from server to ensure we're in sync
                    dispatch(fetchAllAddresses(user.id));
                } else {
                    toast.error("Failed to add address");
                }
            }
        } catch (error) {
            console.error("Error managing address:", error);
            toast.error("Failed to process address operation");
        }
    };

    const handleDeleteAddress = async (address: Address) => {
        if (!user?.id) {
            toast.error("Please log in to delete addresses");
            return;
        }

        try {
            // Remove from local state immediately for responsive UI
            const filteredAddresses = localAddresses.filter(addr => addr._id !== address._id);
            setLocalAddresses(filteredAddresses);
            
            // Also update Redux store directly
            dispatch(setAddressList(filteredAddresses));
            
            const result = await dispatch(
                deleteAddress({
                    userId: user.id,
                    addressId: address._id,
                })
            );

            if (result?.meta?.requestStatus === "fulfilled") {
                toast.success("Address deleted successfully");
            } else {
                toast.error("Failed to delete address");
                // If delete fails, fetch addresses again
                dispatch(fetchAllAddresses(user.id));
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Failed to delete address");
            // Refresh addresses on error
            dispatch(fetchAllAddresses(user.id));
        }
    };

    const handleEditAddress = (address: Address) => {
        setCurrentEditedId(address._id);
        setFormData({
            address: address.address,
            city: address.city,
            phone: address.phone,
            pincode: address.pincode,
            notes: address.notes || "",
        });
    };

    // Initial fetch of addresses
    useEffect(() => {
        const loadAddresses = async () => {
            if (user?.id) {
                try {
                    await dispatch(fetchAllAddresses(user.id));
                } catch (error) {
                    console.error("Error fetching addresses:", error);
                }
            }
        };
        
        loadAddresses();
    }, [dispatch, user?.id]);

    return (
        <Card>
            {isLoading && localAddresses.length === 0 ? (
                <div className="p-6 text-center">Loading addresses...</div>
            ) : (
                <>
                    <div className="mb-5 grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                        {localAddresses && localAddresses.length > 0 ? (
                            localAddresses.map((address) => (
                                <AddressCard
                                    key={address._id}
                                    selectedId={selectedId || ""}
                                    addressInfo={address}
                                    handleEditAddress={handleEditAddress}
                                    handleDeleteAddress={handleDeleteAddress}
                                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                                />
                            ))
                        ) : (
                            <div className="col-span-full p-4 text-center text-gray-500">
                                No addresses found. Add a new address below.
                            </div>
                        )}
                    </div>

                    <CardHeader>
                        <CardTitle>
                            {currentEditedId ? "Edit Address" : "Add New Address"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <CommonForm
                            formControls={addressFormControls}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId ? "Update" : "Add"}
                            onSubmit={handleManageAddress}
                            isBtnDisabled={!isFormValid()}
                        />
                    </CardContent>
                </>
            )}
        </Card>
    );
}

export default Address;