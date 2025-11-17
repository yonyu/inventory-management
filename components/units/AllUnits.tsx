"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Modal,
    Snackbar,
    Alert,
} from "@mui/material";

import Grid from '@mui/material/Grid';
import { Edit, Delete, Add } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import { useAddUnitMutation, useGetUnitsQuery, useDeleteUnitMutation, useUpdateUnitMutation } from "@/lib/features/units/unitsApiSlice";
















const UnitTable = () => {

    const dispatch = useAppDispatch();

    const { data, error, isLoading: loading } = useGetUnitsQuery();

    let units: any;
    units = data?.units || [];
    console.log("Units", units);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [newUnitName, setNewUnitName] = useState("");

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [selectedUnit, setSelectedUnit] = useState<any>(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [filter, setFilter] = useState("");

    const [editUnitName, setEditUnitName] = useState("");
    const [openEditModal, setOpenEditModal] = useState(false);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleOpenEditModal = (unit: any) => {
        setOpenEditModal(true);
        setSelectedUnit(unit);
        setEditUnitName(unit.name);
    };


    const handleEditUnit = () => {
        updateUnit({ id: selectedUnit?._id, data: { name: editUnitName } }).unwrap()
            .then(()=>{
                setSnackbar({ open: true, message: "Unit updated successfully", severity: "success", });
                handleCloseEditModal();
            })
            .catch((error: any)=>{
                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });
            });

    }




    const [addUnit] = useAddUnitMutation();
    const [deleteUnit] = useDeleteUnitMutation();
    const [updateUnit] = useUpdateUnitMutation();



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


    const handleAddUnit= ()=> {
        const newUnit = { name: newUnitName };

        addUnit(newUnit).unwrap()
            .then(()=>{
                setSnackbar({ open: true, message: "Unit added successfully", severity: "success", });

                handleCloseAddModal();

            })
            .catch((error: any)=>{

                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });

                console.error("Error adding unit:", error);
            });
    }


    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleDeleteUnit = () => {
        deleteUnit(selectedUnit?._id).unwrap()
            .then(()=>{
                setSnackbar({ open: true, message: "Unit deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any)=>{
                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });
            });


    }


    const handleOpenDeleteModal = (unit: any) => {
        setSelectedUnit(unit);
        setOpenDeleteModal(true);

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredUnits = units.filter((unit : any) =>

        unit?.name?.toLowerCase().includes(filter.toLowerCase())
    )


    const handleFilterChange = (e : any)=> {
        setFilter(e.target.value);
    }

    return (
        <Box sx={{ p: 2 }} >
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
                Units
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
                        Add Unit
                    </Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{overflowX: 'auto'}} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Unit Name</TableCell>
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
                            filteredUnits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((unit: any, index: number) => (
                                <TableRow key={unit._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{unit.name}</TableCell>
                                    <TableCell>
                                        <IconButton

                                            onClick={() => handleOpenEditModal(unit)}
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
                                                onClick={() => handleOpenDeleteModal(unit)}
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
                    count={ filteredUnits.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white"}}
                />
            </TableContainer>

            {/* start add unit modal */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-unit-modal"
                aria-describedby="add-unit-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="add-unit-modal" variant="h6" component="h2">
                        Add Unit
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Unit Name"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}

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
                            onClick={handleAddUnit}
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

            {/* end add unit modal */}


            {/* start edit unit modal */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-unit-modal"
                aria-describedby="edit-unit-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-unit-modal" variant="h6" component="h2">
                        Edit Unit
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Unit Name"
                        value={editUnitName}
                        onChange={(e) => setEditUnitName(e.target.value)}
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
                            onClick={handleEditUnit}
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
            {/* end edit unit modal */}


            {/* start delete unit modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-unit-modal"
                aria-describedby="delet-unit-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-unit-modal" variant="h6" component="h2">
                        Delete Unit
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete this unit?

                        { JSON.stringify(selectedUnit) }

                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            onClick={handleCloseDeleteModal}
                            sx={{ mr: 1 }}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteUnit}
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

            {/* end delete unit modal */}



            {/* snackbar */}
            <Snackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}

                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity as "success" | "error" | "info" | "warning" | undefined}
                    sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>



        </Box>
    );
} // end UnitTable()


const modalStyle = { // 334
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundcolor: "black",
    p: 4,
    borderRadius: 2,
    boxShadow: 130,
    width: "90%",
    maxWidth: "600px",

    border: "2px solid #000",     
    color: "white",
};

const modalBackdropStyle = {
    backdropFilter: "blur(8px)",
};

export default UnitTable;
