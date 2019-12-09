import React from 'react';

var infoIcon = function({ message, close }) {
  return (
    <div className="alert alert-info alert-dismissible fade show">
      <strong>Info!</strong> {message}.
      <button type="button" className={close} data-dismiss="alert">
        &times;
      </button>
    </div>
  );
};

var errorIcon = function({ message, close }) {
  return (
    <div class="alert alert-danger alert-dismissible fade show">
      <strong>Error!</strong> {message}
      <button type="button" class={close} data-dismiss="alert">
        &times;
      </button>
    </div>
  );
};

var successIcon = function({ message, close }) {
  return (
    <div class="alert alert-success alert-dismissible fade show">
      <strong>Error!</strong> {message}
      <button type="button" class={close} data-dismiss="alert">
        &times;
      </button>
    </div>
  );
};

export const standardTemplate = ({ style, options, message, close }) => (
  <div style={style}>
    {options.type === 'info' && infoIcon(message, close)}
    {options.type === 'success' && successIcon(message, close)}
    {options.type === 'error' && errorIcon(message, close)}
  </div>
);

// var AlertTemplate = function AlertTemplate(_ref) {
//   var message = _ref.message,
//       options = _ref.options,
//       style = _ref.style,
//       close = _ref.close;

//   return React.createElement(
//     'div',
//     { style: _extends({}, alertStyle, style) },
//     options.type === 'info' && React.createElement(InfoIcon, null),
//     options.type === 'success' && React.createElement(SuccessIcon, null),
//     options.type === 'error' && React.createElement(ErrorIcon, null),
//     React.createElement(
//       'span',
//       { style: { flex: 2 } },
//       message
//     ),
//     React.createElement(
//       'button',
//       { onClick: close, style: buttonStyle },
//       React.createElement(CloseIcon, null)
//     )
//   );
// };

// // module.exports = AlertTemplate;
