import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Grid,
    Box,
    Select,
    MenuItem,
    useTheme,
    FormHelperText,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ak from "../../../assets/images/ak.png";
import pistol from "../../../assets/images/pistol.png";
import knife from "../../../assets/images/knife2.png";
import others from "../../../assets/images/others.png";
import { useDispatch, useSelector } from "react-redux";
import { setLock, setPage } from "src/store/reducers/registerReport";
import { css } from "@emotion/css";
import { WeaponChoices } from "src/constants/weapons";

function Page4() {
    const data = useSelector((state) => state.reportRegister.data);
    const {
        weapons,
        fully_auto_weapons,
        semi_auto_weapons,
        knife_weapons,
        other_weapons,
        fully_auto_weapons_count,
        semi_auto_weapons_count,
        knife_weapons_count,
        other_weapons_count,
    } = data;
    const [error, setError] = useState("");
    const [selectedValues, setSelectedValues] = useState({
        fully_auto_weapons: "",
        semi_auto_weapons: "",
        knife_weapons: "",
        other_weapons: "",
        // Add other fields as needed
    });
    const dispatch = useDispatch();

    const [fields, setFields] = useState([
        {
            name: "fully_auto_weapons",
            cname: "fully_auto_weapons_count",
            label: (
                <>
                    Fully automatic
                    <br />
                    <span style={{ fontSize: "14px", textAlign: "left" }}>
                        (machine gun, assault rifle)
                    </span>
                </>
            ),
            imageSrc: ak,
            bool: fully_auto_weapons ? true : false,
            imageAlt: "Fully automatic(machine gun, assault rifle)",
            imageStyle: { width: "60px", height: "auto" },
            message: <>Specify the number of weapons found of this type</>,
        },
        {
            name: "semi_auto_weapons",
            cname: "semi_auto_weapons_count",
            bool: semi_auto_weapons ? true : false,
            label: (
                <>
                    Semi automatic
                    <br />
                    <span style={{ fontSize: "14px", textAlign: "left" }}>
                        (pistol, handgun)
                    </span>
                </>
            ),
            imageSrc: pistol,
            imageAlt: "Semi automatic(pistol, handgun)",
            imageStyle: {
                width: "40px",
                height: "40px",
                transform: "scaleX(1)",
            },
            message: <>Specify the number of weapons found of this type</>,
        },
        {
            name: "knife_weapons",
            cname: "knife_weapons_count",
            label: "Knife",
            imageSrc: knife,
            imageAlt: "Knife",
            bool: knife_weapons ? true : false,
            message: <>Specify the number of weapons found of this type</>,
        },
        {
            name: "other_weapons",
            cname: "other_weapons_count",
            label: "Unusual Weapon",
            imageSrc: others,
            imageAlt: "Others",
            bool: other_weapons ? true : false,
            message: <>Specify the number of weapons found of this type</>,
        },
    ]);

    useEffect(() => {
        const weaponSum =
            fully_auto_weapons +
            semi_auto_weapons +
            knife_weapons +
            other_weapons;
        if (weaponSum <= 0 && weapons === -1) {
            setError("*Weapons count should be at least one");
            dispatch(setLock(true));
        } else {
            setError("");
            dispatch(setLock(false));
        }
    }, [
        weapons,
        fully_auto_weapons,
        semi_auto_weapons,
        knife_weapons,
        other_weapons,
    ]);

    const handleChange = (event) => {
        dispatch(setPage({ weapons: Number(event.target.value) }));
    };

    const handleCount = (e) => {
        const { name, value } = e.target;
        let convertedValue;

        let updatedFields = [...fields]; // Create a copy of the fields array

        // Check if the value starts with (i), (ii), or (iii)
        if (value.startsWith("(i)")) {
            convertedValue = 1;

            // Find the corresponding field in the copy and update its bool property to true
            updatedFields = updatedFields.map((field) =>
                field.name === name ? { ...field, bool: true } : field
            );
        } else if (value.startsWith("(ii)")) {
            convertedValue = 2;
            updatedFields = updatedFields.map((field) =>
                field.name === name ? { ...field, bool: false } : field
            );
        } else if (value.startsWith("(iii)")) {
            convertedValue = 3;
            updatedFields = updatedFields.map((field) =>
                field.name === name ? { ...field, bool: false } : field
            );
        } else {
            // If it doesn't start with any of the specified patterns, keep the original value
            convertedValue = value;
        }

        // Update the state with the modified fields array
        setFields(updatedFields);

        dispatch(setPage({ [name]: convertedValue }));
    };
    const handleCount2 = (e) => {
        const { name, value } = e.target;
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        dispatch(setPage({ [name]: value }));
    };

    useEffect(() => {}, [fields]);

    const theme = useTheme();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ paddingTop: "40px" }}
                >
                    <Grid item xs={10} sx={{ paddingBottom: "20px" }}>
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
                                variant="h4"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                    textAlign: "center",
                                }}
                            >
                                Weapons
                            </Typography>
                            <Box
                                borderBottom={2}
                                borderColor={theme.palette.warning.main}
                                style={{ marginLeft: "5px", width: "20px" }}
                            />
                        </Box>
                    </Grid>
                    <Box
                        paddingLeft="40px"
                        display="flex"
                        className={css`
                            flex-direction: column;
                        `}
                    >
                        <Typography
                            id="number-picker-label"
                            style={{
                                paddingBottom: "16px",
                                textAlign: "center",
                                fontSize: "16px",
                            }}
                        >
                            Perpetrator(s) had weapon(s)?
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={weapons === 0}
                                    value={0}
                                    onChange={handleChange}
                                />
                            }
                            label="Unknown"
                            sx={{ paddingBottom: "20px" }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={weapons === 1}
                                    value={1}
                                    onChange={handleChange}
                                />
                            }
                            label="Yes, perpetrator(s) had weapon(s)"
                            sx={{
                                paddingBottom: weapons === -1 ? "0px" : "20px",
                            }}
                        />
                        <Box display={weapons === 1 ? "block" : "none"} mb={4}>
                            {error && (
                                <FormHelperText sx={{ color: "red", ml: 2 }}>
                                    {error}
                                </FormHelperText>
                            )}
                            <Box component={"ul"} sx={{ mt: 4 }}>
                                {fields.map((f, ind) => {
                                    return (
                                        <>
                                            <li
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "start",
                                                    alignItems: "center",
                                                    margin: "3",
                                                    width: "100%",
                                                }}
                                                key={ind}
                                            >
                                                <Select
                                                    sx={{
                                                        width: "80px",
                                                        marginBottom: "5px",
                                                    }}
                                                    name={f.name}
                                                    value={
                                                        data[f.name] === 1
                                                            ? "(i).Perpetrator used or fired this weapon"
                                                            : data[f.name] === 2
                                                            ? "(ii).Perpetrator did not use or fire this weapon"
                                                            : data[f.name] === 3
                                                            ? "(iii).Unknown if weapon was used or fired"
                                                            : ""
                                                    }
                                                    onChange={handleCount}
                                                    MenuProps={{
                                                        MenuListProps: {
                                                            autoWidth: true,
                                                        },
                                                    }}
                                                >
                                                    {WeaponChoices.map(
                                                        (weapon, ind) => (
                                                            <MenuItem
                                                                value={weapon}
                                                                key={ind}
                                                            >
                                                                {weapon}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                                <Typography
                                                    sx={{
                                                        fontWeight: "normal",
                                                        fontSize: "16px",
                                                        paddingX: 2,
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {f.label}
                                                </Typography>
                                                <img
                                                    src={f.imageSrc}
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        ...f.imageStyle,
                                                    }}
                                                    alt={f.imageAlt}
                                                />
                                            </li>
                                            {f.bool && (
                                                <li
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "start",
                                                        alignItems: "center",
                                                        margin: "3",
                                                        width: "100%",
                                                    }}
                                                    key={ind + 1}
                                                >
                                                    <Select
                                                        sx={{
                                                            width: "80px",
                                                            marginBottom: "5px",
                                                        }}
                                                        name={f.cname}
                                                        value={
                                                            data[f.cname]
                                                                ? data[f.cname]
                                                                : ""
                                                        }
                                                        onChange={handleCount2}
                                                        MenuProps={{
                                                            MenuListProps: {
                                                                autoWidth: true,
                                                            },
                                                        }}
                                                    >
                                                        {/* Generate menu items for numbers 1-30 */}
                                                        {[
                                                            ...Array(30).keys(),
                                                        ].map((number) => (
                                                            <MenuItem
                                                                value={
                                                                    number + 1
                                                                }
                                                                key={number}
                                                            >
                                                                {number + 1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>

                                                    <Typography
                                                        sx={{
                                                            fontWeight:
                                                                "normal",
                                                            fontSize: "16px",
                                                            paddingX: 2,
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        {f.message}
                                                    </Typography>
                                                </li>
                                            )}
                                        </>
                                    );
                                })}
                            </Box>
                        </Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={weapons === 2}
                                    value={2}
                                    onChange={handleChange}
                                />
                            }
                            label="No, perpetrator(s) did not have weapon(s)"
                            sx={{ paddingBottom: "20px" }}
                        />
                    </Box>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
}

export default Page4;
