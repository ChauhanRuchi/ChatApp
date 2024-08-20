import { useContext } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";

function Login() {
    const { loginInfo, updateLoginInfo, LoginUser } = useContext(AuthContext);
    let navigate=useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await LoginUser(e); // Assuming registerUser returns a promise
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
                            <h2>Login</h2>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginInfo?.email}
                                onChange={handleChange}
                            />
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginInfo?.password}
                                onChange={handleChange}
                            />
                            <Button variant="primary" type="submit">Login</Button>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default Login;
