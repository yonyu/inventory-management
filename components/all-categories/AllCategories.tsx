"use client";

import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,


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




import Grid from '@mui/material/Grid';











import { Edit, Delete, Add } from "@mui/icons-material";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";


import CircularProgress from "@mui/material/CircularProgress";

import { useAddCategoryMutation, useGetCategoriesQuery, useDeleteCategoryMutation, useUpdateCategoryMutation } from "@/lib/features/categories/categoriesApiSlice";


const CategoryTable = () => { // 56

    const dispatch = useAppDispatch();

    const { data, error, isLoading: loading } = useGetCategoriesQuery();

    let categories: any;
    categories = data?.categories || [];
    console.log("categories", categories);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [filter, setFilter] = useState("");

    const [editCategoryName, setEditCategoryName] = useState("");
    const [openEditModal, setOpenEditModal] = useState(false);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleOpenEditModal = (category: any) => {
        setOpenEditModal(true);
        setSelectedCategory(category);
        setEditCategoryName(category.name);
    };


    const handleEditCategory= () => {
        // Not working: update relies on id is specified
        // const updatedCategory= { ...selectedCategory, name: editCategoryName };
        // updateCategory(updatedCategory).unwrap()
        updateCategory({ id: selectedCategory?._id, data: { name: editCategoryName } }).unwrap()
            .then(()=>{
                setSnackbar({ open: true, message: "Category updated successfully", severity: "success", });
                handleCloseEditModal();
            })
            .catch((error: any)=>{
                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });
            });

    }




    const [addCategory] = useAddCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();



    const handleChangePage = (event: unknown, newPage: number) => { // 120
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleOpenAddModal=()=>{

        setOpenAddModal(true);
    };


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


    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleDeleteCategory= () => {
        deleteCategory(selectedCategory?._id).unwrap()
            .then(()=>{
                setSnackbar({ open: true, message: "Category deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any)=>{
                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });
            });


    }


    const handleOpenDeleteModal = (category: any) => {
        setSelectedCategory(category);
        setOpenDeleteModal(true);

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredCategories = categories.filter((category : any) =>

        category?.name?.toLowerCase().includes(filter.toLowerCase())
    )


    const handleFilterChange = (e : any)=> {
        setFilter(e.target.value);
    }

    return (
        <Box sx={{ p: 2, maxWidth: "100%", width: "4096px" }} >
            <Typography variant="h4" sx={{ mb: 2 }}
                style={{
                    fontSize: "3rem",
                    color: "0073e6", // a nice blue color
                    marginBottom: "20px", // 1rem = 16px
                    textAlign: "center",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(109, 71, 71, 0.2)", // add a subtle shadow
                    padding: "10px",
                    borderBottom: "2px solid #0073e6", // underline effect
                    letterSpacing: "1px",
                }}

            >
                Categories
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search......"

                        value={filter}
                        onChange={handleFilterChange}


                        sx={{
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
                <Grid size={{ xs: 12, sm: 4 }}>     {/* item xs={12} sm={4}> */}
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={ <Add />}
                        onClick={handleOpenAddModal}
                        sx={{
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
            <TableContainer component={Paper} sx={{overflowX: 'auto'}} >
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
                            filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category: any, index: number) => (
                                <TableRow key={category._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <IconButton

                                            onClick={() => handleOpenEditModal(category)}
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


                                            sx={{ color: "red" }}
                                        >
                                            <Delete
                                                onClick={() => handleOpenDeleteModal(category)}
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={ filteredCategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white"}}
                />
            </TableContainer>


            {/* start add category modal */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-category-modal"
                aria-describedby="add-category-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="add-category-modal" variant="h6" component="h2">
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
                        sx={{
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
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            onClick={handleCloseAddModal}

                            sx={{ mr: 1 }}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddCategory}
                            sx={{
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

            {/* end add category modal */}


            {/* start edit category modal */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-category-modal"
                aria-describedby="edit-category-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-category-modal" variant="h6" component="h2">
                        Edit Category
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Category Name"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        slotProps={{ // InputLabelProps
                            inputLabel: { style: { color: 'white', },  },
                        }}
                        sx={{
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
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            onClick={handleCloseEditModal}
                            sx={{ mr: 1 }}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditCategory}
                            sx={{
                                backgroundColor: "blue",
                                "&:hover": {
                                    backgroundColor: "blue",
                                },
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* end edit category modal */}






            {/* start delete category modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-category-modal"
                aria-describedby="delet-category-modal-description"
                sx={modalBackdropStyle}
            >
                <Box
                    sx={modalStyle}

                >
                    <Typography id="delete-category-modal" variant="h6" component="h2">
                        Delete Category
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete this category?

                        { JSON.stringify(selectedCategory) }

                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button

                            onClick={handleCloseDeleteModal}
                            sx={{ mr: 1 }}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteCategory}
                            sx={{
                                backgroundColor: "red",
                                "&:hover": {
                                    backgroundColor: "darkred",
                                },
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* end delete category modal */}



            {/* snackbar */}
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
                    {snackbar.message}
                </Alert>
            </Snackbar>



        </Box>
    );
} // end CategoryTable()



const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "black",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    color: "white",
};

const modalBackdropStyle = {
    backdropFilter: "blur(5px)",
};

export default CategoryTable;
