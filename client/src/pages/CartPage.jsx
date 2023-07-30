import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../api/axiosClient";
import getAPI from "../api/getApi.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function CartPage() {
  // const { data: cartItems } = queryClient.getQueryData("cart") || {};
  const { data: carts, refetch } = useQuery(["cart"], () => getAPI.getCarts());

  const {
    mutate,
    isLoading: loading,
    isSuccess,
    data,
  } = useMutation((id) => getAPI.removeFromCart({ id }), {
    onSuccess: () => {
      refetch();
      toast.success("Removed item from cart");
    },
  });

  async function handleRemoveItem(id) {
    try {
      mutate(id);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleCheckout(cart) {
    const {
      data: { items, user },
    } = cart;
    const newItems = items.map((item) => ({
      name: item.name,
      price: item.price,
    }));
    const newTransaction = {
      items: newItems,
      cart_id: cart.data._id,
      user_id: user,
    };
    await axios
      .post(`${baseURL}/transaction/create`, newTransaction)
      .then((resp) => resp.data)
      .then((data) => toast.success(data.message))
      .catch((err) => toast.error(err.message))
      .finally(() => {
        refetch();
      });
  }

  return (
    <>
      <Navbar />

      <div className="p-8 grid place-items-center">
        <h1 className="text-2xl flex justify-center font-bold mb-4">
          Your Cart
        </h1>
        {carts?.data?.items?.length ? (
          <div className="flex flex-col w-1/2 ">
            {carts?.data?.items?.map((item) => (
              <div key={item._id} className="flex mb-10">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-1/4 rounded-md"
                />
                <div className="flex-1 ml-4">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <div className="font-bold text-lg text-red-500">
                    ${item.price}
                  </div>

                  <p className="text-gray-600">{item.desc}</p>
                </div>
                <div className="flex items-center mt-4">
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="font-bold text-2xl text-right mt-8">
              Total Price: ${carts.data?.totalPrice}
            </div>
            <button
              className="w-fit bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              onClick={() => handleCheckout(carts)}
            >
              Checkout
            </button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CartPage;