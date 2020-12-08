import { Form, Input, Button, Select } from 'antd';
import { useHistory } from 'react-router-dom'
import { Card } from 'antd';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { login, signinWithGoogle, signinWithFacebook } from '../../apiUser'
import './Login.css'

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const tailLayout = {
    wrapperCol: {
        span: 24,
    },
};

const Login = () => {
    const [form] = Form.useForm();
    const history = useHistory();

    const onFinish = (values) => {
        const { email, password } = values;

        login({ email, password }).then(res => {
            if (res.data) {
                history.push('/');
            }
        })
            .catch(error => {
                console.log(error)
            })

    };

    const responseSuccessGoogle = (response) => {
        const { tokenId } = response;

        signinWithGoogle(tokenId).then(res => {
            console.log(res.data);
        })
            .catch(error => {
                console.log(error);
            })
    }

    const responseFacebook = (response) => {
        const { userID, accessToken } = response;
        signinWithFacebook(userID, accessToken).then(res => {
            console.log(res.data)
        })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <>
            <Card className="card" title="Login" bordered={false} style={{ width: 300 }}>
                <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item {...tailLayout} className='login-form-button'>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <GoogleLogin
                            clientId="990188398227-bb3t5mt068kdj4350d3mvmqhcqeftkl8.apps.googleusercontent.com"
                            buttonText="Google"
                            onSuccess={responseSuccessGoogle}
                            className='google-login mt-2'
                            cookiePolicy={'single_host_origin'}
                        />
                        <FacebookLogin
                            appId="891593248045556"
                            autoLoad={false}
                            fields="id,name,email"
                            callback={responseFacebook}
                            cssClass='facebook-login'
                            textButton="Facebook"
                            icon="fa-facebook mt-2" />
                        <Button className="redirect-to-register" type="link" htmlType="button" onClick>
                            Don't have an account? Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default Login;