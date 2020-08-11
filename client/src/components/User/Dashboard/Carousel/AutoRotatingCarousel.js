import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import { duration } from "@material-ui/core/styles/transitions";
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import Dots from "material-ui-dots";
import classNames from "classnames";
import Carousel from "./SwipableCarouselView";
import { modulo } from "./util";
import carouselStyles from "../../../../styles/User/Dashboard/components/Carousel/carouselStyles";

class AutoRotatingCarousel extends Component {
  state = {
    slideIndex: 0,
  };

  handleContentClick = (e) => e.stopPropagation() || e.preventDefault();

  handleChange = (slideIndex) => {
    this.setState(
      {
        slideIndex,
      },
      this.onChange(slideIndex)
    );
  };

  decreaseIndex() {
    const slideIndex = this.state.slideIndex - 1;
    this.setState(
      {
        slideIndex,
      },
      this.onChange(slideIndex)
    );
  }

  increaseIndex() {
    const slideIndex = this.state.slideIndex + 1;
    this.setState(
      {
        slideIndex,
      },
      this.onChange(slideIndex)
    );
  }

  onChange(slideIndex) {
    if (this.props.onChange) {
      this.props.onChange(modulo(slideIndex, this.props.children.length));
    }
  }

  render() {
    const {
      autoplay,
      ButtonProps,
      children,
      classes,
      containerStyle,
      hideArrows,
      interval,
      label,
      landscape: landscapeProp,
      mobile,
      ModalProps,
      open,
      onClose,
      onStart,
    } = this.props;
    const landscape = mobile && landscapeProp;
    const transitionDuration = {
      enter: duration.enteringScreen,
      exit: duration.leavingScreen,
    };
    const hasMultipleChildren = children.length != null;

    const carousel = (
      <Carousel
        autoplay={open && autoplay && hasMultipleChildren}
        className={classes.carousel}
        containerStyle={{ height: "100%", ...containerStyle }}
        index={this.state.slideIndex}
        interval={interval}
        onChangeIndex={this.handleChange}
        slideClassName={classes.slide}
      >
        {React.Children.map(children, (c) =>
          React.cloneElement(c, {
            mobile,
            landscape,
          })
        )}
      </Carousel>
    );

    return (
      <Modal
        className={classNames(classes.root, {
          [classes.rootMobile]: mobile,
        })}
        open={open}
        onClose={onClose}
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
        BackdropComponent={Backdrop}
        style={{ position: "absolute", zIndex: 1 }}
        container={() => document.getElementById("carouselContainer")}
        BackdropProps={
          ModalProps
            ? {
                transitionDuration,
                ...ModalProps.BackdropProps,
                style: {
                  position: "absolute",
                  backgroundColor: "transparent",
                },
              }
            : {
                transitionDuration,
                style: {
                  position: "absolute",
                  backgroundColor: "transparent",
                },
              }
        }
        {...ModalProps}
      >
        <Fade appear in={open} timeout={transitionDuration}>
          <div
            className={classNames(classes.content, {
              [classes.contentMobile]: mobile,
            })}
            onClick={this.handleContentClick}
          >
            <Paper
              elevation={mobile ? 0 : 1}
              className={classes.carouselWrapper}
            >
              {carousel}
            </Paper>
            <div
              style={
                landscape
                  ? {
                      minWidth: 300,
                      maxWidth: "calc(50% - 48px)",
                      padding: 24,
                      float: "right",
                    }
                  : null
              }
            >
              <div
                className={classNames(classes.footer, {
                  [classes.footerMobile]: mobile,
                  [classes.footerMobileLandscape]: landscape,
                })}
              >
                {label && (
                  <Button
                    variant="contained"
                    onClick={onStart}
                    {...ButtonProps}
                  >
                    {label}
                  </Button>
                )}
                {hasMultipleChildren && (
                  <Dots
                    count={children.length}
                    index={modulo(this.state.slideIndex, children.length)}
                    className={classNames(classes.dots, {
                      [classes.dotsMobile]: mobile,
                      [classes.dotsMobileLandscape]: landscape,
                    })}
                    style={{ marginTop: 35 }}
                    onDotClick={this.handleChange}
                  />
                )}
              </div>
            </div>
            {!mobile && !hideArrows && hasMultipleChildren && (
              <div className={classes.mobileArrow}>
                <Fab
                  className={classNames(classes.arrow, classes.arrowLeft)}
                  onClick={() => this.decreaseIndex()}
                >
                  <ArrowBackIcon className={classes.arrowIcon} />
                </Fab>
                <Fab
                  className={classNames(classes.arrow, classes.arrowRight)}
                  onClick={() => this.increaseIndex()}
                >
                  <ArrowForwardIcon className={classes.arrowIcon} />
                </Fab>
              </div>
            )}
          </div>
        </Fade>
      </Modal>
    );
  }
}

AutoRotatingCarousel.defaultProps = {
  autoplay: true,
  interval: 3000,
  mobile: false,
  open: false,
  hideArrows: false,
};

AutoRotatingCarousel.propTypes = {
  /** If `false`, the auto play behavior is disabled. */
  autoplay: PropTypes.bool,
  /** Properties applied to the [Button](https://material-ui.com/api/button/) element. */
  ButtonProps: PropTypes.object,
  /** Object for customizing the CSS classes. */
  classes: PropTypes.object.isRequired,
  /** Override the inline-styles of the carousel container. */
  containerStyle: PropTypes.object,
  /** Delay between auto play transitions (in ms). */
  interval: PropTypes.number,
  /** Button text. If not supplied, the button will be hidden. */
  label: PropTypes.string,
  /** If `true`, slide will adjust content for wide mobile screens. */
  landscape: PropTypes.bool,
  /** If `true`, the screen width and height is filled. */
  mobile: PropTypes.bool,
  /** Properties applied to the [Modal](https://material-ui.com/api/modal/) element. */
  ModalProps: PropTypes.object,
  /** Fired when the index changed. Returns current index. */
  onChange: PropTypes.func,
  /** Fired when the gray background of the popup is pressed when it is open. */
  onClose: PropTypes.func,
  /** Fired when the user clicks the getting started button. */
  onStart: PropTypes.func,
  /** Controls whether the AutoRotatingCarousel is opened or not. */
  open: PropTypes.bool,
  /** If `true`, the left and right arrows are hidden in the desktop version. */
  hideArrows: PropTypes.bool,
};

export default withStyles(carouselStyles)(AutoRotatingCarousel);
