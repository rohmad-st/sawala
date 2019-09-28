import React, { Fragment } from 'react';

import { withQismoSDKProps } from '../../containers/withQismoSDK';

import { Room } from '../../types';

import { Icon } from '../Commons';
import Message from './components';

interface InnerProps {
  room?: Room;
}

interface MessageState {
  rows: number;
  value: string;
  minRows: number;
  maxRows: number;
}

type MessageProps = InnerProps & withQismoSDKProps;

class QismoMessage extends React.Component<MessageProps, MessageState> {
  constructor(props: MessageProps) {
    super(props);

    this.state = {
      rows: 1,
      value: '',
      minRows: 1,
      maxRows: 3
    };
  }

  handleChangeComment = (event: any) => {
    const textareaLineHeight: number = 24;
    const { minRows, maxRows } = this.state;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows: number = Math.floor(
      event.target.scrollHeight / textareaLineHeight
    );

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    this.setState({
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows
    });
  };

  handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && event.ctrlKey) {
      if (this.props.onSubmitText) {
        this.props.onSubmitText(this.state.value);
        this.setState({
          value: ''
        });
      }
    }
  };

  render() {
    const { room, activeReplyComment } = this.props;
    console.log('message render', activeReplyComment);
    return room ? (
      <Fragment>
        {activeReplyComment && (
          <Message.Preview show>
            <Message.PreviewButton type="button" color="secondary">
              <Icon image="reply-icon" size="24px" color="#ffffff" />
            </Message.PreviewButton>
            <Message.PreviewContent>
              <Message.h4>{activeReplyComment.username_as}</Message.h4>
              <Message.p>{activeReplyComment.message}</Message.p>
            </Message.PreviewContent>
            <Message.CloseButton
              type="button"
              color="secondary"
              onClick={() => {
                if (this.props.onCloseReplyCommment) {
                  this.props.onCloseReplyCommment();
                }
              }}
            >
              <Icon image="close-icon" size="24px" color="#676b6d" />
            </Message.CloseButton>
          </Message.Preview>
        )}
        <Message.Index>
          <Message.Action>
            <Message.Button
              type="button"
              color="secondary"
              onClick={(e: any) => {
                e.stopPropagation();
                document.getElementById('btn-file')!.click();
              }}
            >
              <Icon image="file-icon" size="24px" color="#949A9D" />
            </Message.Button>
            <Message.Button
              type="button"
              color="secondary"
              onClick={(e: any) => {
                e.stopPropagation();
                document.getElementById('btn-image')!.click();
              }}
            >
              <Icon image="img-icon" size="24px" color="#949A9D" />
            </Message.Button>
            <input
              type="file"
              id="btn-image"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(event: any) => {
                const file = Array.from(event.currentTarget.files).pop();
                if (this.props.onPreviewImage) {
                  this.props.onPreviewImage(file as File);
                }
              }}
            />
            <input
              type="file"
              id="btn-file"
              style={{ display: 'none' }}
              onChange={(event: any) => {
                const file = Array.from(event.currentTarget.files).pop();
                if (this.props.onSubmitFile) {
                  this.props.onSubmitFile(file as File);
                }
              }}
            />
          </Message.Action>
          <Message.Comment>
            <Message.Textarea
              rows={this.state.rows}
              value={this.state.value}
              cols={30}
              placeholder="Send a message..."
              onChange={this.handleChangeComment}
              onKeyDown={this.handleKeyDown}
            />
          </Message.Comment>
          <Message.Action>
            <Message.Button
              type="button"
              color="secondary"
              onClick={(event: any) => {
                event.stopPropagation();
                event.preventDefault();

                if (this.props.onSubmitText) {
                  this.props.onSubmitText(this.state.value);
                  this.setState({
                    value: ''
                  });
                }
              }}
            >
              <Icon image="send-icon" size="24px" color="#006fe6" />
            </Message.Button>
          </Message.Action>
        </Message.Index>
      </Fragment>
    ) : null;
  }
}

export default QismoMessage;
