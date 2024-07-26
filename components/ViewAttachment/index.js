'use client';

import React, { useRef, useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';

function ViewAttachment(props) {
  useEffect(() => {
    document.addEventListener("keydown", onDocumentKeyDown, false);

    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown, false);
    }
  }, [])

  useEffect(() => {
    // console.log('ViewAttachment > props.fileAttachment', props.fileAttachment)
  }, [props.fileAttachment])

  const onDocumentKeyDown = (event) => {
    const charCode = event.keyCode || event.which;
    // console.log('onChatInputKeyPress > charCode', charCode)

    switch (charCode) {
      case 27: // ESC
        onCloseViewAttachmentClick();
        break;
    }
  }

  const onCloseViewAttachmentClick = (event) => {
    if (props.onCloseViewAttachment) {
      props.onCloseViewAttachment();
    }
  }

  function renderAttachmentByType(item, key, type) {
    if (type && type.includes('image')) {
      return (<img key={key} className="view-attachment-item" src={`./attachments/${item?.name}`} />);
    }
    if (type && type.includes('video')) {
      return (
        <video key={key} className="view-attachment-item" autoPlay controls>
          <source src={`./attachments/${item?.name}`} />
        </video>
      )
    }

    return null;
  }

  return (
    <div className="view-attachment">
      <div className="view-attachment-container">
        <div className="view-attachment-header">
          <a href={`./attachments/${props.fileAttachment?.name}`} download className="download"><FontAwesomeIcon icon={faDownload} size="lg" /></a>
          <span className="close" onClick={onCloseViewAttachmentClick}><FontAwesomeIcon icon={faTimes} size="lg" /></span>
        </div>
        <div className="view-attachment-body">
          {renderAttachmentByType(props.fileAttachment, 1, props.fileAttachment?.type)}
        </div>
      </div>
    </div>
  )
}

export default ViewAttachment