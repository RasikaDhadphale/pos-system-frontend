import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { ListChecks} from 'lucide-react';
import { OrderCheck } from '../../types/types';
import { printOrderCheck } from './utils';

export const ClosedOrdersScreen: React.FC = () => {
    const { closedChecks } = useAppState();
    const [selectedCheck, setSelectedCheck] = useState<OrderCheck>();
  
    return (
        <div className="flex flex-col h-full p-4 bg-white rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                <ListChecks className="mr-2" /> Closed Checks ({closedChecks.length})
            </h2>
            <div className="flex-grow overflow-y-auto space-y-4"> 
                {closedChecks.length === 0 ? (
                    <div className="text-center p-10 text-gray-500 italic">
                        No orders for today. Start a new order!
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-100 text-gray-500 uppercase text-sm">
                                <th className="p-4">Check ID</th>
                                <th className="p-4">Time</th>
                                <th className="p-4">Table</th>
                                <th className="p-4">Cover</th>
                                <th className="p-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {closedChecks ? (closedChecks.map((check) => (
                                <tr key={check.orderId} onClick={() => setSelectedCheck(check)} className="border-b hover:bg-blue-50 cursor-pointer transition">
                                    <td className="p-4 font-semibold">{check.orderId}</td>
                                    <td className="p-4">{check.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="p-4">{check.tableNumber}</td>
                                    <td className="p-4">{check.covers}</td>
                                    <td className="p-4 font-bold text-teal-600">{check.grandTotal}</td>
                                </tr>
                            ))):(<></>)}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedCheck && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">Check #{selectedCheck.orderId}</h3>
                        <div className="space-y-3 border-y py-4 mb-6">
                            {selectedCheck.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-gray-700">
                                    <span>{item.quantity}x {item.dishName}</span>
                                    <span>{item.price}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold text-xl pt-2">
                                <span>Total</span>
                                <span>{selectedCheck.grandTotal}</span>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setSelectedCheck(undefined)} className="px-6 py-2 text-gray-500 font-semibold">Cancel</button>
                            <button onClick={ () => printOrderCheck(selectedCheck, true)}className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold shadow-md hover:bg-amber-600">Reprint</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
