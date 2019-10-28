/**
 * 'Higher Order Component' that controls the props of a wrapped
 * component via stores.
 *
 * Expects the Component to have two static methods:
 *   - getStores(): Should return an array of stores.
 *   - getPropsFromStores(props): Should return the props from the stores.
 *
 * Example using old React.createClass() style:
 *
 *    const MyComponent = React.createClass({
 *      statics: {
 *        getStores(props) {
 *          return [myStore]
 *        },
 *        getPropsFromStores(props) {
 *          return myStore.getState()
 *        },
 *        storeDidChange(props) {
 *          // Optional: do something after the state has been set
 *        }
 *      },
 *      render() {
 *        // Use this.props like normal ...
 *      }
 *    })
 *    MyComponent = connectToStores(MyComponent)
 *
 *
 * Example using ES6 Class:
 *
 *    class MyComponent extends React.Component {
 *      static getStores(props) {
 *        return [myStore]
 *      }
 *      static getPropsFromStores(props) {
 *        return myStore.getState()
 *      }
 *      render() {
 *        // Use this.props like normal ...
 *      }
 *    }
 *    MyComponent = connectToStores(MyComponent)
 *
 * A great explanation of the merits of higher order components can be found at
 * http://bit.ly/1abPkrP
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _functions = require('./functions');

function connectToStores(Spec) {
  var Component = arguments.length <= 1 || arguments[1] === undefined ? Spec : arguments[1];
  return (function () {
    // Check for required static methods.
    if (!(0, _functions.isFunction)(Spec.getStores)) {
      throw new Error('connectToStores() expects the wrapped component to have a static getStores() method');
    }
    if (!(0, _functions.isFunction)(Spec.getPropsFromStores)) {
      throw new Error('connectToStores() expects the wrapped component to have a static getPropsFromStores() method');
    }

    if (typeof Spec.storeDidChange === 'undefined') {
      var storeDidChange = function storeDidChange() {}; // no-op
    } else if (!(0, _functions.isFunction)(Spec.storeDidChange)) {
        throw new Error('connectToStores() expects the storeDidChange() to be a function');
      } else {
        var storeDidChange = Spec.storeDidChange;
      }

    var StoreConnection = (function (_React$Component) {
      _inherits(StoreConnection, _React$Component);

      function StoreConnection(props, context) {
        _classCallCheck(this, StoreConnection);

        _get(Object.getPrototypeOf(StoreConnection.prototype), 'constructor', this).call(this, props, context);
        this.state = Spec.getPropsFromStores(props, context);

        this.onChange = this.onChange.bind(this);
      }

      _createClass(StoreConnection, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          this.setState(Spec.getPropsFromStores(nextProps, this.context));
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this = this;

          var stores = Spec.getStores(this.props, this.context);
          this.storeListeners = stores.map(function (store) {
            return store.listen(_this.onChange);
          });
          if (Spec.componentDidConnect) {
            Spec.componentDidConnect(this.props, this.context);
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.storeListeners && this.storeListeners.forEach(function (unlisten) {
            return unlisten();
          });
        }
      }, {
        key: 'onChange',
        value: function onChange() {
          this.setState(Spec.getPropsFromStores(this.props, this.context));
          storeDidChange(this.state);
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2['default'].createElement(Component, (0, _functions.assign)({}, this.props, this.state));
        }
      }]);

      return StoreConnection;
    })(_react2['default'].Component);

    StoreConnection.displayName = 'Stateful' + (Component.displayName || Component.name || 'Container');

    if (Component.contextTypes) {
      StoreConnection.contextTypes = Component.contextTypes;
    }

    return StoreConnection;
  })();
}

exports['default'] = connectToStores;
module.exports = exports['default'];