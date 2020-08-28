import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const FAQAccordion = (props) => {
  const { title, questions } = props;

  const renderAccordion = () => {
    return questions.map((question, index) => {
      return (
        <Accordion
          key={index}
          style={{
            backgroundColor: "#01c9e1",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
          >
            <Typography variant="h5" style={{ color: "white" }}>
              {question.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{
              backgroundColor: "white",
            }}
          >
            <Typography variant="body1" style={{ marginTop: 5 }}>
              {question.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <React.Fragment>
      <Grid item>
        <Typography variant="h1" style={{ color: "#01C9E1" }} gutterBottom>
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        style={{
          width: "100%",
          paddingLeft: 50,
          paddingRight: 50,
          paddingBottom: 25,
        }}
      >
        {renderAccordion()}
      </Grid>
    </React.Fragment>
  );
};

export default FAQAccordion;
