import {gql} from '@apollo/client'
export default gql`
  mutation(
    $_id: ID
    $report_count: Int
  ){
    updateOneUser(
      _id: $_id
      report_count: $report_count
    ){
      _id
    }
  }
`