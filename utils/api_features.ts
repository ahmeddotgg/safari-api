import { Query } from 'mongoose';

export class api_features {
    public query: Query<any, any>;
    private query_string: Record<string, any>;

    constructor(query: Query<any, any>, query_string: Record<string, any>) {
        this.query = query;
        this.query_string = query_string;
    }

    filter() {
        const query_object = { ...this.query_string };
        const special_queries: string[] = ['page', 'sort', 'limit', 'fields'];
        special_queries.forEach((item: string) => delete query_object[item]);

        let query_string = JSON.stringify(query_object);
        query_string = query_string.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(query_string));
        return this;
    }

    sort() {
        if (this.query_string.sort) {
            const sort_by = typeof this.query_string.sort === 'string'
                ? this.query_string.sort.split(',').join(' ')
                : '';
            this.query = this.query.sort(sort_by);
        }
        return this;
    }

    limitFields() {
        if (this.query_string.fields) {
            const selected_fields = typeof this.query_string.fields === 'string'
                ? this.query_string.fields.split(',').join(' ')
                : '';
            this.query = this.query.select(selected_fields);
        } else {
            this.query = this.query.select('-__v -createdAt -updatedAt');
        }
        return this;
    }

    paginate() {
        const page = Number(this.query_string.page) || 1;
        const limit = Number(this.query_string.limit) || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}