import { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';
import { cardContentClasses } from '@mui/material';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width:100%;
`;


const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;
const ConsoleWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;
const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  width:70%;
  padding: 2em;
  overflow: auto;
`;
const tablePaper=styled(Paper)`
  height: 300px;
  width:24%;
  padding 1em;
  overflow: auto;
  float:right;
`
function createData(name,subject,score){
  return {name,subject,score};
}
const rows=[
  createData('John','math',88),
  createData('Mary','English',99),
]
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
         {children}
        </>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
const Body = () => {
  const classes = useStyles();

  const { messages0,messages1, addCardMessage, addRegularMessage, addErrorMessage } =
    useScoreCard();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);
  const [mode,setMode]=useState(0);
  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');
  const [tcontent,setTcontent]= useState([]);
  const handleChange = (func) => (event) => {
   // console.log(event.target.value);
    func(event.target.value);
    //console.log(event.target.value);
  };

  const handleChangeMode = (event, newValue) => {
    setMode(newValue);
  };

  const handleAdd = async () => {
    console.log(`${name},${subject},${score}`);
    const {
      data: { message, card , tablemsg},
    } = await axios.post('/card',{name,subject,score});

    if (!card) addErrorMessage(message);
    else addCardMessage(message);
    setTcontent(tablemsg);
  };

  const handleQuery = async () => {
    const {
      data: { messages, message ,tablemsg },
    } = await axios.get('/cards', {
      params: {
        type: queryType,
        queryString, 
      },
    });

    if (!messages) {
      addErrorMessage(message);
      setTcontent([false,message]);
    }
    else {
      addRegularMessage(...messages);
     setTcontent(tablemsg);
  }
  };
  //////////////////////////////////////////////////////////////
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
//////////////////////////////////////////////////////
  return (
    <Wrapper>
      {/**/}
      
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={mode} onChange={handleChangeMode} aria-label="basic tabs example">
            <Tab label="Add" {...a11yProps(0)} />
            <Tab label="Query" {...a11yProps(1)} />
          </Tabs>
        </Box>
      
      <TabPanel value={mode} index={0}>
        <Row>
          <TextField
            className={classes.input}
            placeholder="Name"
            value={name}
            onChange={handleChange(setName)}
          />
          <TextField
            className={classes.input}
            placeholder="Subject"
            style={{ width: 240 }}
            value={subject}
            onChange={handleChange(setSubject)}
          />
          <TextField
            className={classes.input}
            placeholder="Score"
            value={score}
            onChange={handleChange(setScore)}
            type="number"
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={!name || !subject}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Row>
      </TabPanel>

      <TabPanel value={mode} index={1}>
        <Row>
          <StyledFormControl>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={queryType}
                onChange={handleChange(setQueryType)}
              >
                <FormControlLabel
                  value="name"
                  control={<Radio color="primary" />}
                  label="Name"
                />
                <FormControlLabel
                  value="subject"
                  control={<Radio color="primary" />}
                  label="Subject"
                />
              </RadioGroup>
            </FormControl>
          </StyledFormControl>
          <TextField
            placeholder="Query string..."
            value={queryString}
            onChange={handleChange(setQueryString)}
            style={{ flex: 1 }}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={!queryString}
            onClick={handleQuery}
          >
            Query
          </Button>
        </Row>
      </TabPanel>

      <ConsoleWrapper>
        <ContentPaper variant="outlined">
          {mode===0 ? messages0.map((m, i) => (
            <Typography variant="body2" key={m + i} style={{ color: m.color }}>
              {m.message}
            </Typography>
          )): messages1.map((m, i) => (
            <Typography variant="body2" key={m + i} style={{ color: m.color }}>
              {m.message}
            </Typography>
          ))
            
          }
        </ContentPaper>
        <TableContainer component={Paper} sx={{width:'29%'}} >
              { (tcontent[0]==false) ?
              <Typography variant='h6' >
                {tcontent[1]}
               </Typography>
              :
          <Table aria-label="simple table" >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Subject</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {tcontent.map((row) => (
              <TableRow
                key={row.subject}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.subject}</TableCell>
                <TableCell align="right">{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>}
        </TableContainer>
      </ConsoleWrapper>
      
    </Wrapper>
  );
};

export default Body;
