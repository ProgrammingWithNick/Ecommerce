import * as paypal from 'paypal-rest-sdk';
import { Provider } from '@nestjs/common';

export const PaypalProvider: Provider = {
    provide: 'PAYPAL_SDK',
    useFactory: () => {
        paypal.configure({
            mode: 'sandbox',
            client_id: process.env.PAYPAL_CLIENT_ID,
            client_secret: process.env.PAYPAL_CLIENT_SECRET,
        });


        return paypal;
    },
};
