import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const HierFreelancer = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(db, "Freelancer")
          ); // Replace 'your_collection_name'
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(items);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []); // Empty dependency array to run only on mount

    if (loading) {
      return <div>Loading...</div>;
    }


  return (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">
              {item.firstName} {item.lastName}
            </Typography>
            <Typography variant="body1">{item.email}</Typography>

            {Array.isArray(item.skills) && item.skills.length > 0 && (
              <Typography variant="body2">{item.skills.join(", ")}</Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default HierFreelancer;