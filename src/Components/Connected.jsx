/* eslint-disable react/prop-types */
import {Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from '@nextui-org/react'

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header text-center mb-4">You are Connected to Metamask</h1>
            <p className="connected-account text-center mb-4">Metamask Account: {props.account}</p>
            {/* <p className="connected-account text-center mb-4">Remaining Time: {props.remainingTime}</p> */}
            { props.showButton ? (
                <p className="connected-account text-center mt-4">You have already voted</p>
            ) : (
                <div>
                    <input type="number" placeholder="Entern Candidate Index" value={props.number} onChange={props.handleNumberChange}></input>
            <br />
            <button className="login-button" onClick={props.voteFunction}>Vote</button>

                </div>
            )}
            
            <Table className="dark text-center mt-5">
                <TableHeader>
                    <TableColumn className="text-center">S.No.</TableColumn>
                    <TableColumn className="text-center">Candidate name</TableColumn>
                    <TableColumn className="text-center">Candidate votes</TableColumn>
                </TableHeader>
                <TableBody>
                    {props.candidates.map((candidate, index) => (
                        <TableRow key={index}>
                            <TableCell>{candidate.index+1}</TableCell>
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell>{candidate.voteCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Connected;