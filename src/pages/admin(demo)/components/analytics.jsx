import React from 'react';
import { OrdersCard } from './order';
import { InventoryCard } from './productCard';
import BestSellersCard from './bestseller';

function Analytics({isDark}) {
    return (
        <div className='mb-8'>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:mb-8">
                <OrdersCard isDark={isDark} />
                <InventoryCard isDark={isDark}/>
                <BestSellersCard isDark={isDark}/>
            </div>
        </div>
    );
}

export default Analytics;