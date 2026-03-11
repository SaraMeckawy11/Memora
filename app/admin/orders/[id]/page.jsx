'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if(!id) return
    fetch(`/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.order) {
            setOrder(data.order)
            if(data.order.shipping?.trackingNumber) {
                setTrackingNumber(data.order.shipping.trackingNumber)
            }
        }
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }, [id])

  const updateStatus = async (status) => {
    setUpdating(true)
    try {
        const body = { status }
        if (status === 'shipped') {
            body.trackingNumber = trackingNumber
        }
        
        const res = await fetch(`/api/admin/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            const data = await res.json()
            setOrder(data.order)
        }
    } catch (e) {
        console.error(e)
    } finally {
        setUpdating(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!order) return <div>Order not found</div>

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">Order Information</h3>
            <p className="mt-1 text-sm text-gray-500">Order ID: {order._id}</p>
        </div>
        <div className="flex gap-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                order.status === 'paid' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                order.status === 'shipped' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                'bg-gray-50 text-gray-600 ring-gray-500/10'
            }`}>
                {order.status}
            </span>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.customer.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.customer.email}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.customer.phone}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Total Price</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.totalPrice} EGP</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {order.deliveryAddress.street}, {order.deliveryAddress.building}<br/>
              {order.deliveryAddress.city}, {order.deliveryAddress.governorate}
            </dd>
          </div>
          
          <div className="sm:col-span-2 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
            <div className="flex gap-4 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Tracking Number</label>
                    <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Tracking #"
                    />
                </div>
                <button
                    onClick={() => updateStatus('shipped')}
                    disabled={updating || !trackingNumber || order.status === 'shipped'}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                    Mark as Shipped
                </button>
            </div>
          </div>
        </dl>
      </div>
    </div>
  )
}
