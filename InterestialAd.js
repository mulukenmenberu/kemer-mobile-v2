import React, { useEffect, useState } from 'react';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Test ID for interstitial ad
const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7128439967849555/4585285917'; // Replace with your actual interstitial ad unit ID
const bannerAdUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-7128439967849555/3532058697';

const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdUnitId);

export function InterestialAd({ condition = true, onAdClose }) {
  const [loaded, setLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(true); // Controls banner ad visibility

  useEffect(() => {
    // Load the interstitial ad
    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('Ad loading error:', error);
    });

    // Add event listener for when the ad is closed
    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      // Reload the ad once it's closed
      onAdClose();
      interstitialAd.load();
      
      // Re-display the banner ad after 2 minutes
      setTimeout(() => {
        setShowBanner(true);
      }, 120000); // 120000 milliseconds = 2 minutes
    });

    // Load the ad initially
    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  // Function to show the interstitial ad based on a condition
  const showInterstitialAd = () => {
    if (loaded) {
      setShowBanner(false); // Hide banner ad
      interstitialAd.show();
      setLoaded(false); // Reset the loaded state after showing the ad
    } else {
      console.warn('Ad not loaded yet.');
    }
  };

  // Trigger interstitial ad only when it is loaded and the condition is true
  useEffect(() => {
    if (loaded && condition) {
      showInterstitialAd();
    }
  }, [loaded, condition]);

  return (
    <>
      {showBanner && (
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            networkExtras: {
              collapsible: 'bottom',
            },
          }}
        />
      )}
    </>
  );
}
