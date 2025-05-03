import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('shop/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('add/:userId')
  async addAddress(@Param('userId') userId: string, @Body() body: any): Promise<any> {
    const newAddress = await this.addressService.addAddress(userId, body);
    return { success: true, data: newAddress };
  }

  @Get('get/:userId')
  async fetchAllAddress(@Param('userId') userId: string): Promise<any> {
    const addressList = await this.addressService.fetchAllAddress(userId);
    return { success: true, data: addressList };
  }

  @Put('update/:userId/:addressId')
  async editAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body() formData: any,
  ): Promise<any> {
    const updatedAddress = await this.addressService.editAddress(userId, addressId, formData);
    return { success: true, data: updatedAddress };
  }

  @Delete('delete/:userId/:addressId')
  async deleteAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ): Promise<any> {
    const deletedAddress = await this.addressService.deleteAddress(userId, addressId);
    return { success: true, data: deletedAddress };
  }
}
