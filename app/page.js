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
import { useState } from "react";
import { addDoc, doc, runTransaction } from "firebase/firestore";
import useVisitorItems from "./useVisitorItems";

export default function Home() {
  const headers = ["Product Name", "Quantity", "Operations"];
  const [open, setOpen] = useState(false);
  const { items, loading, busy, error, mutate } = useVisitorItems("pantry-items");
  const [formData, setFormData] = useState({
    item: "",
  });

  const { item } = formData;
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleChange = e => setFormData({ item: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const value = item.trim();
    if (!value || value.length > 120) return;
    if (await mutate(ref => addDoc(ref, { item: value, quantity: 1 }))) {
      setFormData({ item: "" }); setOpen(false);
    }
  };
  const changeQuantity = (id, amount) => mutate(ref => runTransaction(db, async transaction => {
    const itemRef = doc(ref, id);
    const current = await transaction.get(itemRef);
    if (!current.exists()) return;
    const quantity = current.data().quantity + amount;
    if (quantity < 1) transaction.delete(itemRef);
    else transaction.update(itemRef, { quantity: Math.min(quantity, 10000) });
  }));
  const handleAdd = id => changeQuantity(id, 1);
  const handleRemove = id => changeQuantity(id, -1);
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
        <Button variant="contained" disabled={loading || busy} onClick={handleOpen}>
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
              Enter the product name
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
              <Button variant="contained" disabled={busy || loading || !item.trim()} onClick={handleSubmit}>
                Add
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
      <Box>
        <Typography role="status">{loading ? "Connecting…" : "Your personal demo pantry. Saved in this browser’s guest account."}</Typography>
        {error && <Typography role="alert" color="error">{error}</Typography>}
        <Box
          width={"min(800px, 95vw)"}
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
        <Stack width="min(800px, 95vw)" height="500px" spacing={2} overflow={"auto"}>
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
                    disabled={busy || loading} onClick={() => handleAdd(item.id, item.quantity)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    bgcolor={"red"}
                    disabled={busy || loading} onClick={() => handleRemove(item.id, item.quantity)}
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
  width: "min(400px, 95vw)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
