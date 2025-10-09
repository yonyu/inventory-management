"use client";

import React, { useState } from "react";
import Markdown from "react-markdown";

import {
  Button,
  Box,
  Modal,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { border, borderColor } from "@mui/system";

import { runAi } from "@/ai/ai";

// Modal inline styles with increased height and width, and scrollable content
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "black",
  border: "2px solid #000",
  boxShadow: 24,
  borderColor: "blue",
  p: 4,
  overflowY: "auto", // Make modal content scrollable
};

export default function Page() {
  const [reponse, setResponse] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(reponse)
      .then(() => {
        alert("Response copied to clipboard");
      })
      .catch((err) => {
        console.log("Could not copy text ", err);
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    //setOpen(true);

    try {
      const data = await runAi(query);
      //console.log('ai content', response);
      setResponse(data || "");
      handleOpen();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Typography>{reponse}</Typography>
      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <TextField
            fullWidth
            label="Generate Content with AI"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              inputLabel: {
                style: { color: "white" },
              },
              input: {
                style: { color: "white" },
              },
            }}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "blue",
                },
                "&:hover fieldset": {
                  borderColor: "blue",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "blue",
                },
              },
            }}
          ></TextField>
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{
            m: 1,
            p: 2,
            fontWeight: "bold",
            backgroundColor: "blue",
            "&:hover": {
              backgroundColor: "blue",
            },
            height: "100%",
            width: "100%",
          }}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Loading..." : "Generate with AI"}
        </Button>
      </form>

      {/* AI Response Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            AI Response
          </Typography>
          <Box id="modal-description" sx={{ mt: 2 }}>
            {loading ? <CircularProgress /> : <Markdown>{reponse}</Markdown>}
          </Box>
          <Button
            onClick={copyToClipboard}
            color="primary"
            sx={{
              mt: 2,
              mr: 2,
              backgroundColor: "blue",
              color: "white",
              "&:hover": {
                backgroundColor: "darkblue",
              },
            }}
          >
            Copy to Clipboard
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
