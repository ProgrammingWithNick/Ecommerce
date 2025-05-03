import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from 'src/models/address.schema';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<AddressDocument>,
  ) {}

  async addAddress(userId: string, addressData: Omit<Address, '_id'>): Promise<Address> {
    const { address, city, pincode, phone, notes } = addressData;

    if (!userId || !address || !city || !pincode || !phone) {
      throw new BadRequestException('Missing required address fields!');
    }

    const newAddress = new this.addressModel({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    return await newAddress.save();
  }

  async fetchAllAddress(userId: string): Promise<Address[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required!');
    }

    return await this.addressModel.find({ userId });
  }

  async editAddress(userId: string, addressId: string, formData: Partial<Omit<Address, '_id'>>): Promise<Address> {
    if (!userId || !addressId) {
      throw new BadRequestException('User ID and Address ID are required!');
    }

    const updatedAddress = await this.addressModel.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true },
    );

    if (!updatedAddress) {
      throw new NotFoundException('Address not found!');
    }

    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string): Promise<{ _id: string }> {
    if (!userId || !addressId) {
      throw new BadRequestException('User ID and Address ID are required!');
    }

    const deletedAddress = await this.addressModel.findOneAndDelete({ _id: addressId, userId });

    if (!deletedAddress) {
      throw new NotFoundException('Address not found!');
    }

    return { _id: deletedAddress._id as string };
  }
}
