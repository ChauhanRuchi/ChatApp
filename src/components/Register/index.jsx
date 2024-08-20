import { useContext } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";

function Register() {
    const { registerInfo, updateRegisterInfo, registerUser } = useContext(AuthContext);
    let navigate=useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateRegisterInfo({ ...registerInfo, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await registerUser(e); // Assuming registerUser returns a promise
        if (success) {
            navigate("/chat"); // Redirect to the home page after successful registration
        }
    };



    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Row style={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
                    <Col xs={4}>
                        <Stack gap={3}>
                            <h2>Register</h2>
                            <Form.Control
                                type="text"
                                name="user_name"
                                placeholder="Name"
                                value={registerInfo.user_name}
                                onChange={handleChange}
                            />
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={registerInfo.email}
                                onChange={handleChange}
                            />
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerInfo.password}
                                onChange={handleChange}
                            />
                            <Button variant="primary" type="submit">Register</Button>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default Register;
