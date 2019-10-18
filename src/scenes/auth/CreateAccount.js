import React, { Component } from 'react';
import { Alert, Image, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import InstagramLogin from 'react-native-instagram-login';
import CookieManager from 'react-native-cookies';
import { connect } from 'react-redux';

import SceneHeader from '../../components/SceneHeader';
import ThemeButton from '../../components/theme/Button';
import EmailModal from '../../components/EmailModal';
import { joinWithFacebook, joinWithInstagram } from '../../controllers/auth/actions';

const Color = require('color');

class CreateAccount extends Component {
  state = {
    role: 'artist',
    modalVisible: false,
    email: '',
    instagramToken: ''
  };

  onClickFacebook = () => {
    this.props.joinWithFacebook(this.state.role, this.props.navigation, (msg) => Alert.alert(msg));
  }

  onClickInstagram = () => {
    // this.instagramLogin.show();
    this.props.navigation.navigate('ImportMedia');
  }

  renderItem({ checked, title, description, onPress }) {
    return (
      <TouchableOpacity
        style={{
          ...styles.card,
          borderColor: EStyleSheet.value(checked ? '$secondaryColor' : '$grey3Color'),
          ...this.props.appTheme.styles.shadow3
        }}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
          <Text style={{
            ...styles.caption,
            color: EStyleSheet.value(checked ? '$secondaryColor' : '$grey0Color')
          }}>{title}</Text>
          {checked ? (
            <Icon type="material" name="radio-button-checked" size={EStyleSheet.value('20rem')} color={EStyleSheet.value('$secondaryColor')} />
          ) : (
            <Icon type="material" name="radio-button-unchecked" size={EStyleSheet.value('20rem')} color={EStyleSheet.value('$label')} />
          )}
        </View>
        <Text style={styles.overview}>{description}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SceneHeader />
        <View style={styles.body}>
          <Text style={styles.titleText}>Create an account</Text>
          <Text style={styles.smallText}>Please select how do you want to use the app</Text>
          <View style={{ flex: 1 }}>
            {this.renderItem({
              checked: this.state.role === 'artist',
              title: 'As an Artist',
              description: "I'll showcase and sell my services on the platform",
              onPress: () => this.setState({ role: 'artist' })
            })}
            {this.renderItem({
              checked: this.state.role === 'client',
              title: 'As a Client',
              description: "I'll find and book services from the best artists around",
              onPress: () => this.setState({ role: 'client' })
            })}
          </View>
          <View style={{ alignItems: 'center' }}>
            <ThemeButton
              buttonStyle={styles.button}
              icon={{
                name: 'facebook',
                type: 'font-awesome',
                size: EStyleSheet.value('20rem'),
                containerStyle: styles.buttonIcon
              }}
              title="Join with Facebook"
              titleStyle={styles.buttonTitle}
              onPress={this.onClickFacebook}
            />
            <ThemeButton
              buttonStyle={{ ...styles.button, marginTop: EStyleSheet.value('16rem') }}
              icon={{
                name: 'instagram',
                type: 'font-awesome',
                size: EStyleSheet.value('20rem'),
                containerStyle: styles.buttonIcon
              }}
              title="Join with Instagram"
              titleStyle={styles.buttonTitle}
              onPress={this.onClickInstagram}
            />
            <InstagramLogin
              containerStyle={styles.instagram}
              ref={c => this.instagramLogin = c}
              clientId="2862949e166644b3a94fc2c483d744f2"
              redirectUrl="https://muanation.com/"
              scopes={['basic']}
              onLoginSuccess={(token) => {
                console.log('Instagram login succeeded', token);
                this.setState({
                  modalVisible: true,
                  instagramToken: token
                });
              }}
              onLoginFailure={(reason) => {
                console.log('Instagram login failed', reason);
                this.props.joinWithInstagramFailure();
                Alert.alert(reason);
              }}
            />
          </View>
        </View>
        <EmailModal
          visible={this.state.modalVisible}
          onAccept={(email) => {
            this.setState({ modalVisible: false });
            this.props.joinWithInstagram(this.state.role, this.state.instagramToken, email, this.props.navigation, (reason) => Alert.alert(reason));
          }}
          onReject={() => this.setState({ modalVisible: false })}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '16rem',
    backgroundColor: '$container'
  },
  body: {
    flex: 1,
    marginHorizontal: '60rem'
  },
  titleText: {
    color: '$title',
    fontFamily: 'Roboto',
    fontSize: '24rem',
    fontWeight: 'bold'
  },
  smallText: {
    marginTop: '16rem',
    marginBottom: '28rem',
    color: '$label',
    fontFamily: 'Roboto',
    fontSize: '14rem'
  },
  card: {
    width: '100%',
    marginVertical: '10rem',
    padding: '24rem',
    borderWidth: '1rem',
    borderRadius: '12rem',
    backgroundColor: '$card'
  },
  caption: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: '18rem',
    fontWeight: 'bold'
  },
  overview: {
    marginTop: '8rem',
    color: '$label',
    fontFamily: 'Roboto',
    fontSize: '14rem'
  },
  button: {
    width: '254rem',
    height: '48rem',
    borderRadius: '12rem'
  },
  buttonIcon: {
    marginRight: '10rem'
  },
  buttonTitle: {
    fontFamily: 'Roboto',
    fontSize: '16rem',
    fontWeight: 'bold'
  },
  instagram: {
    backgroundColor: '$overlay0Color'
  }
});

const mapStateToProps = ({
  common: { theme }
}) => ({
  appTheme: theme
});

const mapDispatchToProps = (dispacth) => ({
  joinWithFacebook: (role, onError) => dispacth(joinWithFacebook(role, onError)),
  joinWithInstagram: (role, token, email, onError) => dispacth(joinWithInstagram(role, token, email, onError)),
  joinWithInstagramFailure: () => dispacth({ type: types.JOIN_WITH_INSTAGRAM_FAILURE })
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
