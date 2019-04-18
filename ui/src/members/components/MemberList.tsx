// Libraries
import React, {PureComponent} from 'react'

// Components
import {IndexList} from 'src/clockface'
import MemberRow from 'src/members/components/MemberRow'

// Types
import {Member} from 'src/types'
import {SortTypes} from 'src/shared/selectors/sort'
import {Sort} from '@influxdata/clockface'

// Selectors
import {getSortedResources} from 'src/shared/selectors/sort'

type SortKey = keyof Member

interface Props {
  members: Member[]
  emptyState: JSX.Element
  onDelete: (member: Member) => void
  sortKey: string
  sortDirection: Sort
  sortType: SortTypes
  onClickColumn: (nextSort: Sort, sortKey: SortKey) => void
}

export default class MemberList extends PureComponent<Props> {
  public static getDerivedStateFromProps(props: Props) {
    return {
      sortedMembers: getSortedResources(props.members, props),
    }
  }

  public state = {
    sortedMembers: this.props.members,
  }

  public render() {
    const {sortKey, sortDirection, onClickColumn} = this.props

    return (
      <IndexList>
        <IndexList.Header>
          <IndexList.HeaderCell
            sortKey={this.headerKeys[0]}
            sort={sortKey === this.headerKeys[0] ? sortDirection : Sort.None}
            columnName="Username"
            width="20%"
            onClick={onClickColumn}
          />
          <IndexList.HeaderCell
            sortKey={this.headerKeys[1]}
            sort={sortKey === this.headerKeys[1] ? sortDirection : Sort.None}
            columnName="Role"
            width="20%"
            onClick={onClickColumn}
          />
          <IndexList.HeaderCell width="60%" />
        </IndexList.Header>
        <IndexList.Body
          columnCount={3}
          emptyState={this.props.emptyState}
          data-testid="members-list"
        >
          {this.rows}
        </IndexList.Body>
      </IndexList>
    )
  }

  private get headerKeys(): SortKey[] {
    return ['name', 'role']
  }

  private get rows(): JSX.Element[] {
    const {onDelete} = this.props
    const {sortedMembers} = this.state

    return sortedMembers.map(member => (
      <MemberRow key={member.id} member={member} onDelete={onDelete} />
    ))
  }
}
