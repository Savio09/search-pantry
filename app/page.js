"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Home() {
  const headers = ["Product Name", "Quantity", "Operations"];
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null);
  const [formData, setFormData] = useState({
    item: "",
  });

  const { item } = formData;
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // Add stuff to the database

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) {
      return;
    }
    const newItem = { item, quantity: 1 };
    await addDoc(collection(db, "pantry-items"), {
      item: newItem.item,
      quantity: newItem.quantity,
    });
    setFormData({
      item: "",
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleAdd = () => {
  //   setQuantity((prevState) => prevState + 1);
  // };
  // const handleRemove = () => {};

  const handleAdd = async (id, quantity) => {
    const itemRef = doc(db, "pantry-items", id);
    await updateDoc(itemRef, {
      quantity: quantity + 1,
    });
  };

  const handleRemove = async (id, quantity) => {
    const itemRef = doc(db, "pantry-items", id);
    if (quantity === 1) {
      return await deleteDoc(itemRef);
    }

    await updateDoc(itemRef, {
      quantity: quantity - 1,
    });
  };

  useEffect(() => {
    const q = query(collection(db, "pantry-items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) =>
        itemsArr.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      console.log(itemsArr);
      setItems(itemsArr);
      return () => unsubscribe();
    });
  }, []);
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <>
        <Button variant="contained" onClick={handleOpen}>
          Add Items
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter the product's name.
            </Typography>
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Product name"
                variant="outlined"
                value={item}
                onChange={handleChange}
                name="item"
              />
              <Button variant="contained" onClick={handleSubmit}>
                Add
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
      <Box>
        <Box
          width={"800px"}
          height="100px"
          bgcolor={"lightblue"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color="#333" textAlign={"center"}>
            Pantry Tracker
          </Typography>
        </Box>
        <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
          {headers.map((header, index) => (
            // This is a comment
            <Typography key={index}>{header}</Typography>
          ))}
        </Box>
        <Stack width="800px" height="500px" spacing={2} overflow={"auto"}>
          {items &&
            items.map((item) => (
              <Box
                key={item.id}
                width="100%"
                height="100px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
              >
                <Typography variant={"h4"} color={"#333"}>
                  {item.item.charAt(0).toUpperCase() + item.item.slice(1)}
                </Typography>
                <Typography>{item.quantity}</Typography>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => handleAdd(item.id, item.quantity)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    bgcolor={"red"}
                    onClick={() => handleRemove(item.id, item.quantity)}
                    style={{ margin: "0 10px" }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
