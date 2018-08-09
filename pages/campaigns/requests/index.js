import React from 'react';
import Layout from '../../../components/Layout';
import Campaign from "../../../ethereum/campaign";
import { Button, Table } from 'semantic-ui-react';
import {Link} from '../../../routes';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends React.Component {
    static async getInitialProps(props) {
        const { address } = props.query;

        const campaign = Campaign(address);
        const requestsCount = await campaign.methods.getRequestCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestsCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        return {address, requests, requestsCount, approversCount};
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            )
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>Request</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestsCount} requests</div>
            </Layout>
        );
    }
}

export default RequestIndex;