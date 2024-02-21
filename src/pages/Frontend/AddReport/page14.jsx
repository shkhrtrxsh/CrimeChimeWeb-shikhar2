import {
    Container,
    Typography,
    useTheme,
    Grid,
    Box,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "src/store/reducers/registerReport";

const Page14 = () => {
    const { various: checked = [] } = useSelector(
        (state) => state.reportRegister.data
    );
    const { is_drug_related } = useSelector((state) => ({
        ...state.reportRegister.data,
    }));
    const [drugRelatedOption, setDrugRelatedOption] = useState(1);
    const dispatch = useDispatch();

    const setChecked = (various) => dispatch(setPage({ various }));
    const theme = useTheme();

    const handleChange = (event) => {
        const checkboxValue = Number(event.target.value);
        if (!event.target.checked) {
            const removedChecked = checked.filter((d) => d !== checkboxValue);
            setChecked(removedChecked);
            // Reset the drugRelatedOption when drug-related checkbox is unchecked
            setDrugRelatedOption(0);
        } else {
            let removedChecked = checked;
            if (checkboxValue !== 2) {
                removedChecked = checked.filter((d) => d !== 2);
            }
            setChecked([...new Set([...removedChecked, checkboxValue])]);

            // If the drug-related checkbox is checked, set an initial value for drugRelatedOption
            if (checkboxValue === 0) {
                setDrugRelatedOption(3);
                dispatch(setPage({ is_drug_related: 2 }));
            }
        }
    };
    const handleDrugRelatedOptionChange = (event) => {
        setDrugRelatedOption(parseInt(event.target.value));
        dispatch(setPage({ is_drug_related: drugRelatedOption }));
    };
    useEffect(() => {
        if (is_drug_related) {
            setDrugRelatedOption(is_drug_related);
        }
    }, []);
    // const handleChange = (event) => {

    //   if (event.target.value === 2) {
    //     // If "Does not apply" is checked, uncheck other checkboxes
    //     if (checked.includes(2)) {
    //       setChecked([2]);
    //     } else {
    //       setChecked([]);
    //     }
    //   } else {
    //     // If other checkboxes are checked, uncheck "Does not apply"
    //     const removedChecked = checked.filter((d) => d !== 2);
    //     setChecked([...new Set([...removedChecked, Number(event.target.value)])]);
    //   }
    // };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ paddingY: 0 }}
                    mt={5}
                >
                    <Grid item xs={10} className="pt-5">
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                borderBottom={2}
                                borderColor={theme.palette.warning.main}
                                style={{ marginRight: "5px", width: "20px" }}
                            />
                            <Typography
                                variant="h1"
                                align="center"
                                style={{
                                    fontWeight: "bold",
                                    paddingBottom: "5px",
                                    fontSize: "24px",
                                }}
                            >
                                Various
                            </Typography>
                            <Box
                                borderBottom={2}
                                borderColor={theme.palette.warning.main}
                                style={{ marginLeft: "5px", width: "20px" }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={9} sx={{ pl: 5, pt: 0 }}>
                        <Typography
                            id="number-picker-label"
                            style={{
                                paddingBottom: "16px",
                                textAlign: "center",
                                fontSize: "16px",
                            }}
                        >
                            Check all boxes that apply.
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(2)}
                                    value={2}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    Does not apply
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(1)}
                                    value={1}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    Crime occurred at ATM
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(0)}
                                    value={0}
                                    onChange={handleChange}
                                />

                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    I believe this crime to be drug-related
                                    <br />
                                    <span
                                        style={{
                                            textAlign: "left",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        perpetrator involved with or under
                                        influence of drugs
                                    </span>
                                </Typography>
                            </Box>
                            <Typography>
                                {checked.includes(0) && (
                                    <FormControl sx={{ ml: 9 }}>
                                        <Select
                                            labelId="drug-related-options-label"
                                            id="drug-related-options"
                                            value={drugRelatedOption}
                                            onChange={
                                                handleDrugRelatedOptionChange
                                            }
                                            sx={{ width: "260px" }}
                                        >
                                            <MenuItem value="2">
                                                Perpetrator(s) buying/selling
                                                drugs
                                            </MenuItem>
                                            <MenuItem value="3">
                                                Perpetrator(s) under the
                                                influence of drugs/alcohol
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(3)}
                                    value={3}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    I believe this crime to be gang-related
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(4)}
                                    value={4}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    Arson was involved
                                    <br />
                                    <span
                                        style={{
                                            textAlign: "left",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        deliberately setting fire to property
                                    </span>
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(5)}
                                    value={5}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    Vandalism was involved
                                    <br />
                                    <span
                                        style={{
                                            textAlign: "left",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        deliberately damage or destruction of
                                        property
                                    </span>
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(6)}
                                    value={6}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    Social unrest
                                    <br />
                                    <span
                                        style={{
                                            textAlign: "left",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        barricades, tire burning, riots
                                    </span>
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    pl: 2,
                                    py: 1,
                                }}
                            >
                                <Checkbox
                                    checked={checked && checked.includes(7)}
                                    value={7}
                                    onChange={handleChange}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "normal",
                                        px: 2,
                                        textAlign: "left",
                                    }}
                                >
                                    Bombs were involved
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default Page14;
