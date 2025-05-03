import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

interface Address {
    _id: string;
    address: string;
    city: string;
    phone: string;
    pincode: string;
    notes?: string;
    userId: string;
}

type Props = {
    addressInfo: Address;
    handleDeleteAddress: (address: Address) => void;
    handleEditAddress: (address: Address) => void;
    setCurrentSelectedAddress?: (address: Address) => void;
    selectedId?: string;
};

function AddressCard({
    addressInfo,
    handleDeleteAddress,
    handleEditAddress,
    setCurrentSelectedAddress,
    selectedId,
}: Props) {
    const isSelected = selectedId === addressInfo._id;
    
    const handleCardClick = () => {
        if (setCurrentSelectedAddress) {
            setCurrentSelectedAddress(addressInfo);
        }
    };
    
    return (
        <Card
            onClick={handleCardClick}
            className={`cursor-pointer transition-all duration-200 ${
                isSelected
                    ? "border-4 border-red-600 shadow-md"
                    : "border border-gray-300 hover:shadow"
            }`}
        >
            <CardContent className="grid gap-2 p-4 text-sm text-gray-800">
                <Label><strong>Address:</strong> {addressInfo.address}</Label>
                <Label><strong>City:</strong> {addressInfo.city}</Label>
                <Label><strong>Pincode:</strong> {addressInfo.pincode}</Label>
                <Label><strong>Phone:</strong> {addressInfo.phone}</Label>
                {addressInfo.notes && (
                    <Label><strong>Notes:</strong> {addressInfo.notes}</Label>
                )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2 p-3">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addressInfo);
                    }}
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addressInfo);
                    }}
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}

export default AddressCard;