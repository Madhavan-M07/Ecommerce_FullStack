import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {backendURL} from '../App'
import { toast } from "react-toastify";



const List = ({token}) => {
  const [list, setList] = useState([]);

  const fetchData = async () => {
    try{

      const res = await axios.get(backendURL + '/api/product/list',{
        headers:{
          token
        }
      });     
      if(res.data.success){
        setList(res.data.products);
      }else{
        toast.error(res.data.msg);
      }
      
    }catch(err){
      console.log(err);
      toast.error(err.message);

    }
  };

  const removeProduct = async(id) => {
    try{
      const res = await axios.post(backendURL + '/api/product/remove',{
        id
      },{
        headers:{
          token
        }
      });
      if(res.data.success){
        toast.success(res.data.msg);
        await fetchData();
      }else{
        toast.error(res.data.msg);
      }
      console.log(res.data);

    }catch(err){
      console.log(err);
      toast.error(err.message);
    }
  }




  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <p className="mb-2">All Products List</p>
    <div className="flex flex-col gap-2">

      {/* ---------- List Table Title -------------- */}

      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className="text-center">Action</b>
      </div>
      {/* ------- Product List -------- */}

      {
        list.map((item,index)=>(

         <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm " key={index} >

          <img className="w-12" src={item.image[0]} alt="" />
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>{item.currency}{item.price}</p>
          <p onClick={()=>removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-large">X</p>

          </div>

        ))
      }


    </div>

    </>

  )
}

export default List;
