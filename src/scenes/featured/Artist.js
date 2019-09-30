import React, { Component, PureComponent } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';

import SceneHeader from '../../components/SceneHeader';
import ThemeButton from '../../components/theme/Button';
import CategoryBar from '../../components/CategoryBar';
import { getArtist, getArtistProducts } from '../../controllers/artist/actions';

const Color = require('color');

const criteria = [0, 1, 2, 3, 4];

class Artist extends Component {
  componentDidMount() {
    const { width } = Dimensions.get('window');
    this.imageWidth = (width - 16 * 3) / 2;
    this.imageHeight = Math.floor(this.imageWidth * 0.8);

    const id = this.props.navigation.getParam('id');
    this.props.getArtist(id);
    this.props.getArtistProducts(id, '');
  }

  onChangeCategory(category) {
    const id = this.props.navigation.getParam('id');
    this.props.getArtistProducts(id, category);
  }

  onRelations(category) {
    const id = this.props.navigation.getParam('id');
    const { fullName } = this.props.currentArtist;
    this.props.navigation.navigate('Relations', { id, fullName, category });
  }

  renderStatsEdge(value, unit, category) {
    return (
      <TouchableOpacity style={{ alignItems: 'center', margin: 16 }} onPress={() => this.onRelations(category)}>
        <Text style={{ color: this.props.customTheme.title, fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold' }}>{value}</Text>
        <Text style={{ color: this.props.customTheme.label, fontSize: 14, fontFamily: 'Roboto' }}>{unit}</Text>
      </TouchableOpacity>
    );
  }

  onReviews = () => {
    const id = this.props.navigation.getParam('id');
    this.props.navigation.navigate('Reviews', {
      id,
      score: this.props.currentArtist.score,
      reviews: this.props.currentArtist.reviews
    });
  }

  onPressItem(item) {
    this.props.navigation.navigate('PopularProduct');
  }

  renderScore(score, marginHorizontal) {
    return (
      <View style={{ flexDirection: 'row' }}>
        {criteria.map((criterion, index) => (
          <Icon key={index} type="font-awesome" name="star" size={16} color={score > criterion ? this.props.customTheme.fullStar : this.props.customTheme.emptyStar} containerStyle={{ marginHorizontal }} />
        ))}
      </View>
    );
  }

  renderCard() {
    const { avatar, followers, following, score, reviews } = this.props.currentArtist;

    return (
      <View style={styles.card}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.stats}>
          {this.renderStatsEdge(followers, 'followers', 'followers')}
          <TouchableOpacity onPress={this.onReviews}>
            <View style={{ flex: 1, alignItems: 'center', margin: 16 }}>
              {this.renderScore(score, 2)}
              <Text style={{ color: this.props.customTheme.label, fontSize: 14, marginTop: 4 }}>{reviews} reviews</Text>
            </View>
          </TouchableOpacity>
          {this.renderStatsEdge(following, 'following', 'following')}
        </View>
      </View>
    );
  }

  renderActionBar() {
    return (
      <View style={{
        flexDirection: 'row',
        width: '100%',
        padding: 16
      }}>
        <ThemeButton
          title="Book"
          containerStyle={{ flex: 1 }}
          buttonStyle={{ height: 48, borderRadius: 12 }}
          titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
        />
        <ThemeButton
          title="Follow"
          containerStyle={{ flex: 1, marginLeft: 4 }}
          buttonStyle={{ height: 48, borderRadius: 12 }}
          titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
          isPrimary={false}
        />
        <ThemeButton
          icon={{
            name: 'paper-plane',
            type: 'font-awesome',
            size: 22
          }}
          containerStyle={{ marginLeft: 4 }}
          buttonStyle={{ width: 48, height: 48, borderRadius: 12 }}
          titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
          isPrimary={false}
        />
      </View>
    );
  }

  renderItem = ({ item, index, separators }) => {
    return (
      <TouchableOpacity onPress={() => this.onPressItem(item)}>
        <View style={styles.listItem}>
          <FastImage
            style={{
              width: this.imageWidth,
              height: this.imageHeight,
              borderRadius: 4
            }}
            source={{ uri: item.image }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.caption}>
            <Text style={{
              ...styles.name,
              color: this.props.customTheme.title
            }}>{item.name}</Text>
            <Text style={{
              ...styles.price,
              color: this.props.customTheme.palette.secondary
            }}>${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { fullName, overview, tags, products } = this.props.currentArtist;
    let cateogories = [{ label: 'All', value: '' }];
    if (tags)
      tags.map((tag, index) => cateogories.push({ label: tag, value: tag }));

    let images = [];
    this.props.artistProducts.map((product) => images.push(product.image));

    return (
      <View style={{ flex: 1, backgroundColor: this.props.customTheme.container }}>
        <SceneHeader title={fullName} />
        {this.renderCard()}
        <Text style={{
          ...styles.overview,
          color: this.props.customTheme.palette.grey0
        }}>{overview}</Text>
        {this.renderActionBar()}
        <CategoryBar
          tabs={cateogories}
          activeTabColor={this.props.customTheme.title}
          inactiveTabColor={this.props.customTheme.tagTitle}
          underlineColor={this.props.customTheme.title}
          onSelect={(value) => this.onChangeCategory(value)}
        />
        <View style={styles.container}>
          <FlatList
            data={this.props.artistProducts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            numColumns={2}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center'
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginVertical: 16
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16
  },
  overview: {
    marginTop: 8,
    marginHorizontal: 24,
    fontFamily: 'Roboto',
    fontSize: 14
  },
  container: {
    flex: 1,
    marginHorizontal: 8
  },
  listItem: {
    margin: 8
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  name: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  price: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

const mapStateToProps = ({
  common: { theme },
  artist: { currentArtist, artistProducts }
}) => ({
  customTheme: theme,
  currentArtist, artistProducts
});

const mapDispatchToProps = (dispacth) => ({
  getArtist: (id) => dispacth(getArtist(id)),
  getArtistProducts: (id, category) => dispacth(getArtistProducts(id, category))
});

export default connect(mapStateToProps, mapDispatchToProps)(Artist);