
const Login = (props) => {

    // isOpen = true

    
    return (
        <div className="login-container text-center">
            <h1 className="welcome-message">Welcome to Decentralized Voting Application</h1>
            <button className="login-button mt-5" onClick={props.connectWallet}>Login Metamask</button>
        </div>
    )
}

export default Login;