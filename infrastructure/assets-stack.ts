/**
 * Safari Index Assets Stack
 * S3 + CloudFront CDN for static assets
 *
 * Per MVP_FREEZE.md:
 * - Infrastructure changes must be additive
 * - No custom domains yet (uses *.cloudfront.net)
 *
 * Provides:
 * - Private S3 bucket (block public access)
 * - CloudFront distribution with OAC access to S3
 * - Cache policy: long TTL for versioned assets
 * - Security headers for static assets
 */

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

interface AssetsStackProps extends cdk.StackProps {
  envName: string;
  resourcePrefix: string;
}

export class AssetsStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: AssetsStackProps) {
    super(scope, id, props);

    const { resourcePrefix } = props;
    const exportPrefix = resourcePrefix ? 'Staging' : '';

    /**
     * S3 Bucket for static assets
     *
     * Per requirements:
     * - Block all public access (CloudFront only)
     * - No website hosting (CloudFront handles routing)
     */
    this.bucket = new s3.Bucket(this, 'AssetsBucket', {
      bucketName: `${resourcePrefix}safari-index-assets-${this.account}-${this.region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false, // Cost optimization - assets are immutable by naming convention
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Preserve assets on stack deletion
      autoDeleteObjects: false,
    });

    /**
     * Cache Policy for versioned assets
     *
     * Assets use content-hash naming (e.g., main.abc123.js)
     * so we can cache aggressively with long TTLs.
     */
    const cachePolicy = new cloudfront.CachePolicy(this, 'AssetsCachePolicy', {
      cachePolicyName: `${resourcePrefix}safari-index-assets-cache`,
      comment: 'Long TTL cache for versioned static assets',
      defaultTtl: cdk.Duration.days(365),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(1),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
      // No query strings, headers, or cookies in cache key (pure static assets)
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
    });

    /**
     * Response Headers Policy for security
     *
     * Per requirements: security headers suitable for static assets
     */
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      'AssetsResponseHeadersPolicy',
      {
        responseHeadersPolicyName: `${resourcePrefix}safari-index-assets-headers`,
        comment: 'Security headers for static assets',
        securityHeadersBehavior: {
          contentTypeOptions: { override: true }, // X-Content-Type-Options: nosniff
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
          xssProtection: {
            protection: true,
            modeBlock: true,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.days(365),
            includeSubdomains: true,
            override: true,
          },
        },
        customHeadersBehavior: {
          customHeaders: [
            {
              header: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
              override: false, // Don't override if origin sets it
            },
          ],
        },
      }
    );

    /**
     * CloudFront Distribution
     *
     * Per requirements:
     * - OAC access to S3 (no public bucket access)
     * - Default CloudFront domain (no custom domain yet)
     * - No WAF (cost optimization)
     * - No access logs (cost optimization, can enable later if needed)
     */
    this.distribution = new cloudfront.Distribution(this, 'AssetsDistribution', {
      comment: `Safari Index Assets CDN (${props.envName})`,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy,
        responseHeadersPolicy,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
      },
      // Default root object not needed - all assets are path-based
      // Error responses - cache 403/404 errors briefly to reduce origin load
      // Note: For assets CDN, we just cache the error TTL without custom pages
      errorResponses: [
        {
          httpStatus: 403,
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US, Canada, Europe only - cost optimization
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      enableIpv6: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket for static assets',
      exportName: `${exportPrefix}SafariIndexAssetsBucketName`,
    });

    new cdk.CfnOutput(this, 'AssetsDistributionDomain', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain for assets',
      exportName: `${exportPrefix}SafariIndexAssetsDistributionDomain`,
    });

    new cdk.CfnOutput(this, 'AssetsDistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID for cache invalidation',
      exportName: `${exportPrefix}SafariIndexAssetsDistributionId`,
    });
  }
}
