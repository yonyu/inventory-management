"use client";

import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    //Table,
    //TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper,
    Modal,
    Snackbar,


    InputAdornment,

    Alert,

} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Grid from '@mui/material/Grid';



















import { Edit, Delete, Add } from "@mui/icons-material"; // 46

import { useAppSelector, useAppDispatch } from "@/lib/hooks";


import CircularProgress from "@mui/material/CircularProgress"; // 51

import { useAddCategoryMutation, useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";


const CategoryTable = () => { // 56

    const dispatch = useAppDispatch();

    const { data, error, isLoading: loading } = useGetCategoriesQuery();

    let categories: any;
    categories = data?.categories || [];
    console.log("categories", categories);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //const [numberOfCategories, setNumberOfCategories] = useState(10);
    //const { data, isError, isLoading, isSuccess } = useGetCategoriesQuery(numberOfCategories);
    const [openAddModal, setOpenAddModal] = React.useState(false); // 64
    const [newCategoryName, setNewCategoryName] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });





    const handleChangePage = (event: unknown, newPage: number) => { // 68
        setPage(newPage);
    };

 // 72
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }; // 76


    const handleCloseAddModal = () => { // 79
        setOpenAddModal(false);
    };

    const handleOpenAddModal=()=>{ // 83
        setOpenAddModal(true);
    };
    const handleEditCategory = (category: any)=> {};
    const handleDeleteCategory = (category: any)=> {};

    const [addCategory] = useAddCategoryMutation();

    const handleAddCategory= ()=> {
        const newCategory = { name: newCategoryName };

        addCategory(newCategory).unwrap()
            .then(()=>{
                setSnackbar({ open: true, message: "Category added successfully", severity: "success", });
                handleCloseAddModal();
            })
            .catch((error: any)=>{
                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });

                console.error("Error adding category:", error);
            });
    }







    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return ( // 123, 94
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}
                style={{ // 93
                    fontSize: "3rem",
                    color: "0073e6", // a nice blue color
                    marginBottom: "20px", // 1rem = 16px
                    textAlign: "center",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // add a subtle shadow
                    padding: "10px",
                    borderBottom: "2px solid #0073e6", // underline effect
                    letterSpacing: "1px",
                }}

            >
                Categories
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}> {/* 141, 108 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search......"




                        


                        sx={{  // 118
                            input: { color: "white", },
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
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>     {/* 134  item xs={12} sm={4}> */}
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={ <Add />}
                        onClick={handleOpenAddModal}
                        sx={{ // 137
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                            height: "100%",
                        }}
                    >
                        Add Category
                    </Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>



                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}} >
                                        <CircularProgress color="inherit" />
                                        <Typography sx={{ ml: 2 }}>Loading...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={3}>Error: {JSON.stringify(error)}</TableCell>
                            </TableRow>
                        ) : (
                            categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category: any, index: number) => (
                                <TableRow key={category._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <IconButton

                                            onClick={() => handleEditCategory(category)}
                                            sx={{ color: "blue" }}
                                        >
                                            <Edit

                                                sx={{
                                                    color: "blue",
                                                    "&:hover": {
                                                        color: "darkred",
                                                    },
                                                }}

                                            />
                                        </IconButton>
                                        <IconButton


                                            onClick={() => handleDeleteCategory(category)}
                                            sx={{ color: "red" }}
                                        >
                                            <Delete


                                                sx={{
                                                    color: "red",
                                                    "&:hover": {
                                                        color: "darkred",
                                                    },
                                                }}

                                            />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>




                </Table>
            </TableContainer> { /* 273, 223 */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={categories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ // 232
                    backgroundColor: "white"
                }}
            />





            {/* start add category modal 291 */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-category-modal"
                aria-describedby="add-category-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>{/* 248 */}
                    <Typography id="add-categor-modal" variant="h6" >
                        Add Category
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Category Name"
                        value={newCategoryName}

                        onChange={(e) => setNewCategoryName(e.target.value)}



                        slotProps={{
                            inputLabel: { style: { color: 'white', },  },
                        }}
                        sx={{ // 266
                            mt: 2,
                            input: { color: "white",  },
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

                    />
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}> {/* 283  ???? */}
                        <Button
                            onClick={handleCloseAddModal}

                            sx={{ mr: 1 }}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddCategory}
                            sx={{ // 285
                                backgroundColor: "blue",
                                "&:hover": {
                                    backgroundColor: "blue",
                                },
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>


            {/* end add category modal  298 */}







            {/* start edit category modal 307 */}
            {/*<Modal>*/}

            {/*</Modal>*/}











            {/* end edit category modal  363*/}













































            {/* start delete category modal 403 */}
            {/*<Modal>*/}



































            {/*</Modal>*/}

            {/* end delete category modal  442*/}



            {/* 446 */}
            <Snackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}

                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    security={snackbar.severity as "success" | "error" | "info" | "warning" | undefined}
                    sx={{ width: "100%" }}>
                    {snackbar.message}  // 458, 424
                </Alert>
            </Snackbar>
        </Box>
    );
} // end CategoryTable()  // 463, 432

const modalStyle = { // 465, 434
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "black",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    color: "white",
}; //478

const modalBackdropStyle = { // 480
    backdropFilter: "blur(5px)",
};

export default CategoryTable; // 484
