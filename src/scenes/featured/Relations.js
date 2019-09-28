import React, { Component, Fragment } from 'react';
import { Image, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import SceneHeader from '../../components/SceneHeader';
import { getFollowers, getFollowing } from '../../controllers/relation/actions';

const Color = require('color');

class Relations extends Component {
  constructor(props) {
    super(props);

    this.tabs = ['followers', 'following'];
    this.state = {
      activeTab: this.tabs[0]
    };
  }

  componentDidMount() {
    const id = this.props.navigation.getParam('id');
    const category = this.props.navigation.getParam('category');
    switch (this.state.activeTab) {
      case 'followers':
        this.props.getFollowers(id);
        break;
      case 'following':
        this.props.getFollowing(id);
        break;
    }
    this.setState({ activeTab: category });
  }

  onTabChange(activeTab) {
    const id = this.props.navigation.getParam('id');
    switch (activeTab) {
      case 'followers':
        this.props.getFollowers(id);
        break;
      case 'following':
        this.props.getFollowing(id);
        break;
    }
    this.setState({ activeTab });
  }

  renderItem = ({ item, index, separators }) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={{
          ...styles.name,
          color: this.props.customTheme.title
        }}>{item.fullName}</Text>
        {item.followed ? (
          <Button
            buttonStyle={{
              ...styles.button,
              backgroundColor: Color(this.props.customTheme.palette.secondary).alpha(0.1).string()
            }}
            title="Unfollow"
            titleStyle={{
              ...styles.buttonTitle,
              color: this.props.customTheme.palette.secondary
            }}
            TouchableComponent={TouchableOpacity}
          />
        ) : (
          <Button
            buttonStyle={{
              ...styles.button,
              backgroundColor: this.props.customTheme.palette.secondary,
              ...this.props.customTheme.buttonShadow
            }}
            title="Follow"
            titleStyle={{
              ...styles.buttonTitle,
              color: this.props.customTheme.buttonTitle
            }}
            TouchableComponent={TouchableOpacity}
          />
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.customTheme.container }}>
        <SceneHeader title={this.props.navigation.getParam('fullName')} />
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 16 }}>
          {this.tabs.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => this.onTabChange(tab)} style={{ flex: 1 }}>
              <Text style={[styles.tab, tab === this.state.activeTab ? {
                color: this.props.customTheme.title,
                fontWeight: 'bold',
                borderBottomColor: this.props.customTheme.title,
                borderBottomWidth: 2
              } : {
                color: this.props.customTheme.label
              }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <FlatList
            data={this.props.relations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: this.props.customTheme.palette.grey3 }} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: 'Roboto',
    fontSize: 18,
    textTransform: 'capitalize'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
  },
  name: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 18,
    marginHorizontal: 16,
    textTransform: 'capitalize'
  },
  button: {
    width: 88,
    height: 48,
    borderRadius: 12
  },
  buttonTitle: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

const mapStateToProps = ({
  common: { theme },
  relation: { relations }
}) => ({
  customTheme: theme,
  relations
});

const mapDispatchToProps = (dispacth) => ({
  getFollowers: (userId) => dispacth(getFollowers(userId)),
  getFollowing: (userId) => dispacth(getFollowing(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Relations);
