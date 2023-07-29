import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import getAPI from "../../../api/getApi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateQueries } from "@reduxjs/toolkit/query";

// Get Email Template Object. This will be used to populate our email template

const Appointment = () => {
  const [isProcessingAppointment, setIsProcessingAppoinment] = useState({
    status: false,
    id: null,
  });
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery(["appointments"], () =>
    getAPI.getAppointments()
  );

  async function handleAccepptAppointment(item) {
    const {
      _id,
      user: { email },
    } = item;
    setIsProcessingAppoinment({ status: true, id: _id });
    accept(_id, email);
  }

  async function handleDeleteAppointment(item) {
    const {
      _id,
      user: { email },
    } = item;
    setIsProcessingAppoinment({ status: true, id: _id });
    deleteapp(_id, email);
  }

  async function accept(id, to_email) {
    const response = await getAPI.acceptAppointment({ id, to_email });
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    queryClient.invalidateQueries("appointments");
    refetch();
    // setIsProcessingAppoinment({ status: false, id: _id });
  }
  async function deleteapp(id, to_email) {
    const response = await getAPI.deleteAppointment({ id, to_email });
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    queryClient.invalidateQueries("appointments");
    refetch();
    // setIsProcessingAppoinment({ status: false, id: _id });
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
        <h1 className="text-lg font-semibold text-white">Total Employee</h1>
        <button className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-800">
          Refresh
        </button>
      </div>
      <div className="flex-grow px-4 py-6 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                ID
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Name
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Service Name
              </th>

              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Location
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Phone
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Details
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Date
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Status
              </th>
              <th className="p-3 font-medium text-left text-gray-800 border border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((item, index) => (
              <tr key={index}>
                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {index + 1}
                </td>
                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  <img
                    src={item?.user?.profile}
                    alt={item?.user?.username}
                    className="w-4 h-4 rounded-full inline-block mr-5"
                  />
                  {item?.name}
                </td>
                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {item?.category?.name}
                </td>
                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {item?.address}
                </td>
                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {item?.phone}
                </td>

                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {String(item?.details)}
                </td>

                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {new Date(item?.date).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {item?.status ? "delivered" : "Not delivered"}
                </td>

                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-300">
                  {!item?.status && (
                    <button
                      onClick={(e) => handleAccepptAppointment(item)}
                      disabled={
                        isProcessingAppointment.id === item._id &&
                        isProcessingAppointment.status
                      }
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FaCheck className="inline-block align-middle mr-1" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteAppointment(item)}
                    disabled={
                      isProcessingAppointment.id === item._id &&
                      isProcessingAppointment.status
                    }
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    <RiDeleteBin2Line className="inline-block align-middle mr-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointment;
