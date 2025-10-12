"use client";

import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SnapPOS from "@/components/nav/SnapPOS";

//import TopNav from "@/components/nav/TopNav";
const drawerWidth = 380;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(15)} + 10px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 100,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

import { useRouter } from "next/navigation";

export default function SideNav({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [isCollapse, setIsCollapse] = React.useState(true);
  const [isCollapseUnits, setIsCollapseUnits] = React.useState(true);
  const [isCollapseSuppliers, setIsCollapseSuppliers] = React.useState(true);

  const router = useRouter();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const handleCollapseUnits = () => {
    setIsCollapseUnits(!isCollapseUnits);
  };

  const handleCollapseSuppliers = () => {
    setIsCollapseSuppliers(!isCollapseSuppliers);
  }

  const handleNavigation = (path: String)=> {
    router.push(`/dashboard/user/${path}`);
  }


  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#1a1a1a",
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          {/* TopNav */}
          Top
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        slotProps={{
          paper: { className: "hidden-scrollbar" },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <>
                <ChevronRightIcon sx={{ color: "white" }} />
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    variant: "body3",
                    color: "red",
                    fontFamily: "'Pacifico',cursive",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    marginRight: "70px",
                  }}
                >
                  <SnapPOS />
                </Typography>
                <ChevronLeftIcon sx={{ color: "white" }} />
              </>
            )}
          </IconButton>
        </DrawerHeader>

        <Divider
          sx={{
            borderColor: "white",
            backgroundColor: "2px solid white",
          }}
        />

        {/* start dashboard */}
        <List>
          {["dashboard"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => router.push(`/dashboard/user`)}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                      color: "white",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider
          sx={{
            borderColor: "white",
            backgroundColor: "2px solid white",
          }}
        />
        {/* end dashboard */}

        {/* start category */}
        <List>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapse}
          >

            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{

                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Manage Category"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapse} timeout="auto" unmountOnExit>
            {["all-categories"].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton

                    onClick={ ()=> handleNavigation(text) }
                    sx={{ 
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: open ? "initial" : "center",
                      marginLeft: "40px",
                      color: "white",
                      borderBottom: "2px solid white", // 290
                    }}
                  >
                    <ListItemText
                      primary={text.replace(/-/g, " ")}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </Collapse>
        </List>
        <Divider
          sx={{
            borderColor: "white",
            backgroundColor: "2px solid white",
          }}
        />
        {/* end category */}

        {/* start all-units */}

        <List>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseUnits}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Manage Unit"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseUnits ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseUnits} timeout="auto" unmountOnExit>
            {["all-units"].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton

                    onClick={ ()=> handleNavigation(text) }
                    sx={{ 
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: open ? "initial" : "center",
                      marginLeft: "40px",
                      color: "white",
                      borderBottom: "2px solid white",
                    }}
                  >
                    <ListItemText
                      primary={text.replace(/-/g, " ")}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </Collapse>
        </List>
        <Divider
          sx={{
            borderColor: "white",
            backgroundColor: "2px solid white",
          }}
        />
        {/* end all-unit */}


       {/* start suppliers */}

        <List>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseSuppliers}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Manage Supplier"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseSuppliers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseSuppliers} timeout="auto" unmountOnExit>
            {["all-suppliers", "test-one"].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton

                    onClick={ ()=> handleNavigation(text) }
                    sx={{ 
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: open ? "initial" : "center",
                      marginLeft: "40px",
                      color: "white",
                      borderBottom: "2px solid white",
                    }}
                  >
                    <ListItemText
                      primary={text.replace(/-/g, " ")}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </Collapse>
        </List>
        <Divider
          sx={{
            borderColor: "white",
            backgroundColor: "2px solid white",
          }}
        />
        {/* end all suppliers */}

      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        {children}
      </Box>
    </Box>
  );
}
