import CompressionPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import webpack from 'webpack';

export default {
  webpack: {
    plugins: {
      add: [
        // Gzip compression for production
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg|xml|txt|json)$/,
          threshold: 1024, // Lower threshold for better compression
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
        // Brotli compression for better performance
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg|xml|txt|json)$/,
          threshold: 1024,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
      ],
    },
    configure: (webpackConfig, { env, paths }) => {
      if (env === 'production') {
        // Disable source maps for smaller build size
        webpackConfig.devtool = false;

        // Add bundle analyzer only when ANALYZE=true
        if (process.env.ANALYZE === 'true') {
          webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: 'bundle-report.html',
            })
          );
        }

        // Optimize chunks and splitting
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
              },
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 20,
              },
              firebase: {
                test: /[\\/]node_modules[\\/]firebase[\\/]/,
                name: 'firebase',
                chunks: 'all',
                priority: 15,
              },
              framerMotion: {
                test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                name: 'framer-motion',
                chunks: 'all',
                priority: 12,
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
          // Enable runtime chunk for better caching
          runtimeChunk: 'single',
        };

        // Enable module concatenation (scope hoisting)
        webpackConfig.optimization.concatenateModules = true;

        // Tree shaking optimizations
        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.sideEffects = false;

        // Better minimization
        webpackConfig.optimization.minimize = true;

        // Preload/prefetch optimizations
        webpackConfig.plugins.push(
          new webpack.optimize.AggressiveMergingPlugin(),
        );
      }

      // Optimize asset loading with better compression
      webpackConfig.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb - inline smaller images for better performance
          },
        },
        generator: {
          filename: 'static/media/[name].[hash:8][ext]',
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 80
              }
            }
          }
        ]
      });

      // Video optimization
      webpackConfig.module.rules.push({
        test: /\.(mp4|webm|ogg|avi)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8][ext]',
        },
      });

      return webpackConfig;
    },
  },
  devServer: {
    // Enable gzip compression in dev server
    compress: true,
    // Optimize dev server performance
    hot: true,
    historyApiFallback: true,
  },
  babel: {
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
    plugins: [
      // Remove console.log in production
      process.env.NODE_ENV === 'production' && 'transform-remove-console',
    ].filter(Boolean),
  },
};