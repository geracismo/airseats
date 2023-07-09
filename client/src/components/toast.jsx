import { useState } from "react";
import { Toast } from "react-bootstrap";

export function NotificationToast(props) {

    return  (
        <>
            <Toast className="fixed-bottom ms-5 mb-5" show={props.message !== ''} onClose={() => {
                props.setMessage('');
            }} delay={5000} autohide bg="primary">
                <Toast.Header>
                    <strong className="me-auto">INFO</strong>
                    <small>1 sec ago</small>
                </Toast.Header>
                <Toast.Body>
                    <span className="fw-bold">{props.message}</span>
                </Toast.Body>
            </Toast>

            <Toast className="fixed-bottom ms-5 mb-5" show={props.error !== ''} onClose={() => {
                props.setError('');
            }} delay={5000} autohide bg="warning">
                <Toast.Header>
                    <strong className="me-auto">ERROR</strong>
                    <small>1 sec ago</small>
                </Toast.Header>
                <Toast.Body>
                <span className="fw-bold">{props.error}</span>
                </Toast.Body>
            </Toast>
        </>
    )

}