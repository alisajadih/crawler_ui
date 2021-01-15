import { Grid, TextField, Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useMemo, useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ClearIcon from "@material-ui/icons/Clear";
import SuccessModal from "./SuccessModal";
import { CircularProgressWithLabel } from "./LoadingIcon";
import DoneIcon from "@material-ui/icons/Done";
const useStyles = makeStyles(() => ({
  container: {
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
    height: "100%",
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitButton: {
    backgroundColor: "#10B981",
    color: "white",
    "&:hover": {
      backgroundColor: "#065F46",
    },
  },
  columnContainer: {
    position: "relative",
  },
}));
const createSocket = () => {
  return new WebSocket("ws://" + "localhost:8001/ws/");
};
const Main = () => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [crawlId, setCrawlId] = useState(0);
  const [links, setLinks] = useState([
    {
      id: 1,
      value: "",
      loading: 0,
      site_id: 0,
      status: "pending",
    },
  ]);
  // const socket = useMemo(() => createSocket(), []);
  // useEffect(() => {
  //   socket.onopen = () => {}
  //   socket.onmessage = function (e) {
  //     console.log(e);
  //   };
  // }, [socket]);
  const handleChangeLinks = (event, id) => {
    const value = event.target.value;
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, id, value } : item))
    );
  };
  const handleAddLink = () => {
    if (!links.find((l) => l.value === "")) {
      setLinks((prev) => [
        ...prev,
        {
          id: prev.slice(-1)[0].id ? prev.slice(-1)[0].id + 1 : 1,
          site_id: 0,
          value: "",
          loading: false,
          status: "pending",
        },
      ]);
    }
  };
  const handleClearLink = (id) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleStart = async () => {
    const socket = await createSocket();
    socket.onopen = (e) => {
      setLoadingPhase(true);
      // Main.js:98 {"type": "SET_ID", "sites": [{"http://www.sanjesh.org/": 2}]}
      socket.send(
        JSON.stringify({
          initial_links: links.map((item) => item.value),
          depth: 2,
        })
      );
    };

    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data?.type === "SET_ID") {
        data.sites.map((s) => {
          setLinks((prev) =>
            prev.map((item) => ({
              ...item,
              site_id: !item.site_id ? s[item.value] : item.site_id,
            }))
          );
        });
      } else if (data?.site_id) {
        setLinks((prev) =>
          prev.map((item) =>
            item.site_id === data.site_id
              ? {
                  ...item,
                  loading: data.progress,
                  status: Number(data.progress) < 100 ? "loading" : "done",
                }
              : { ...item }
          )
        );
      } else if (data?.is_done) {
        socket.close();
        setLoadingPhase(false);
        setCrawlId(data.crawl_id);
        setIsModalOpen(true);
      }
    };
  };

  console.log(links);
  return (
    <Grid container justify="center" className={classes.container}>
      <Grid
        item
        container
        xs={3}
        direction="column"
        spacing={3}
        className={classes.columnContainer}
      >
        {links.map(({ id, value, loading, status }) => {
          return (
            <Grid key={id} item>
              <TextField
                value={value}
                onChange={(event) => handleChangeLinks(event, id)}
                fullWidth
                label="Enter url"
                variant="outlined"
                disabled={loadingPhase}
                InputProps={{
                  endAdornment:
                    status === "loading" ? (
                      <CircularProgressWithLabel value={loading} />
                    ) : status === "done" ? (
                      <InputAdornment position="end">
                        <DoneIcon color="action" />
                      </InputAdornment>
                    ) : (
                      id !== 1 && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => handleClearLink(id)}
                          >
                            <ClearIcon color="secondary" />
                          </IconButton>
                        </InputAdornment>
                      )
                    ),
                }}
              />
            </Grid>
          );
        })}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={loadingPhase}
            onClick={handleAddLink}
          >
            <AddIcon />
          </Button>
        </Grid>
        <Grid item className={classes.submitButtonContainer}>
          <Button
            disabled={loadingPhase}
            variant="contained"
            fullWidth
            color="primary"
            classes={{
              containedPrimary: classes.submitButton,
            }}
            onClick={handleStart}
            // className={classes.submitButton}
          >
            Start
          </Button>
        </Grid>
        <SuccessModal
          crawlId={crawlId}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      </Grid>
    </Grid>
  );
};

export default Main;
