# TODO: Fix FOREIGN KEY Constraint Error in Bulk Metric Create

## Completed Steps
- [x] Analyzed the error: FOREIGN KEY constraint failed due to invalid data_source_id in bulk-create.
- [x] Identified root cause: MetricCreateSerializer used IntegerField without existence validation.
- [x] Updated MetricCreateSerializer in backend/services/serializers.py to use PrimaryKeyRelatedField for data_source_id validation.
- [x] Updated BulkMetricCreateView in backend/internal_api/views.py to use validated DataSource object in Metric creation.

## Summary
The fix ensures that invalid data_source_id values are caught during serialization validation, preventing the database foreign key error. The endpoint will now return a 400 Bad Request with validation errors if a data_source_id does not exist, instead of a 500 Internal Server Error.
